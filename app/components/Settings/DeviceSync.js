import React, { Component } from 'react';
import PropType from 'prop-types';
import debounce from 'lodash/debounce';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import WarningIcon from '@material-ui/icons/Warning';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import S3 from 'aws-sdk/clients/s3';
import { getFileContents } from '../../utils/localStorage';
import { getBackupProfileStruct } from '../../actions/types';

const style = () => ({
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 23,
    width: 'calc(100vw - 68px)'
  },
  syncSwitch: {
    marginLeft: 0,
    color: 'rgba(0, 0, 0, 0.38)'
  },
  sleeper: {
    animationDuration: '20000ms'
  }
});

type Props = {};

/*
 *
 * The Device Sync Component is responsible for watching the sync events across
 * the system, and persisting the sync data to the backup location.
 *
 */
class DeviceSync extends Component<Props> {
  props: Props;

  state = {
    user: null,
    imported: {
      user: null
    },
    userMessage: '',
    backups: [],
    autoSync: false,
    backupToRestore: null,
    showSyncInfo: false,
    backupsFetched: false,
    sleeping: false
  };

  componentDidMount() {
    // Here we need to kick off the check for the latest data sequence
    this.deferredCommands.push(() => {
      this.handleBackupFetch();
    });
  }

  componentDidUpdate() {
    const {
      user,
      autoSync,
      backups,
      backupToRestore,
      backupsFetched,
      sleeping
    } = this.state;
    const { backupProfile } = this.props;

    // If there is no verified profile, we exit out completely.
    if (!backupProfile.verifiedAt) return;

    if (user) {
      // If the data objects are populated then we trigger the backup persist
      this.handleBackupPersist();
    }

    if (autoSync && !this.subscribed) {
      // We subscribe to a global window event that is created by sync event
      window.addEventListener('sync', this.handleHydrateArchiveState);
      window.addEventListener('activity', this.resetActivityInterval);
      window.addEventListener('mousemove', this.debouncedActivity);
      window.addEventListener('keydown', this.debouncedActivity);
      this.subscribed = true;
    }

    if (!autoSync && !backupToRestore && backupsFetched) {
      // When we first open the app, we pull up the backups
      const lastBackup = backups.pop();
      this.setBackupToRestore(lastBackup);
    }

    if (this.syncs > 10) {
      // As we sync, we fetch the list of backups to populate the state.
      this.handleBackupFetch();
      this.syncs = 0;
    }

    if (backups.length > 10 && autoSync) {
      // Once the backups reach the threshold, we clean up so that we don't
      // have too many old sync files laying around.
      this.handleSyncCleanup();
    }

    this.checkDeferredCommands();

    if (sleeping) {
      clearTimeout(this.activityTimeout);
    }
  }

  componentWillUnmount() {
    // We need to remove the event subscription to clean up.
    window.removeEventListener('sync', this.handleHydrateArchiveState);
    window.removeEventListener('activity', this.resetActivityInterval);
    window.removeEventListener('mousemove', this.debouncedActivity);
    window.removeEventListener('keydown', this.debouncedActivity);
    this.subscribed = false;
  }

  // Local flag for recording the event subscription.
  subscribed = false;

  // Location of the sync objects
  syncLocation = 'device-sync';

  // List of commands to run after render.
  deferredCommands = [];

  // Number of sync events have been fired.
  syncs = 0;

  // Inactivity Timeout contains the ID of the current inactivity counter
  activityTimeout;

  /*
   *
   * For any user interaction events we reset the activity as well.
   * If the activity happens after the app has gone to sleep then we kick off
   * the backup fetch and check.
   *
   */
  debouncedActivity = debounce(
    () => {
      const { sleeping } = this.state;
      if (sleeping) {
        this.deferredCommands.push(() => {
          this.setState({ sleeping: false, autoSync: false });
        });
        this.handleBackupFetch();
      }
      this.resetActivityInterval();
    },
    500,
    { leading: false, trailing: true, maxWait: 1000 }
  );

  /*
   *
   * The Deferred Commands model is to allow us to run functions once the
   * state has been set.
   * This is useful when we want to persist data via a redux action, or run
   * multiple steps to record progress.
   *
   */
  checkDeferredCommands = () => {
    if (!this.deferredCommands.length) return;

    this.deferredCommands = this.deferredCommands.filter(command => {
      command();
      return false;
    });
  };

  /*
   *
   * Check the backup against our stored sync version
   *
   */
  setBackupToRestore = (backup = null) => {
    const { syncVersion } = this.props;
    if (backup && syncVersion.currentVersion !== backup.Key) {
      this.setState({ backupToRestore: backup });
    } else {
      this.setState({ autoSync: true, userMessage: 'Up to date' });
    }
  };

  /*
   *
   * Fetch the persisted sync objects
   *
   */
  handleBackupFetch = () => {
    const { backupProfile } = this.props;
    const { config } = backupProfile;
    const client = new S3({
      accessKeyId: config.accessKey,
      secretAccessKey: config.secretKey,
      region: config.region
    });
    client.listObjectsV2(
      {
        Bucket: config.bucket,
        Prefix: this.syncLocation,
        FetchOwner: false
      },
      (err, data) => {
        if (err)
          this.setState({ userMessage: err.message, backupsFetched: true });
        else this.setState({ backups: data.Contents, backupsFetched: true });
      }
    );
  };

  /*
   *
   * Remove all but the latest sync objects
   *
   */
  handleSyncCleanup = () => {
    const { backups } = this.state;
    backups
      .slice(0, backups.length - 5)
      .map(s3Obj => this.handleBackupDelete(s3Obj.Key));
    this.setState({ backups: [] });
  };

  /*
   *
   * Remove object from S3
   *
   */
  handleBackupDelete = key => {
    console.log('Handle Delete: ', key);
    const { backupProfile } = this.props;
    const { config } = backupProfile;
    const client = new S3({
      accessKeyId: config.accessKey,
      secretAccessKey: config.secretKey,
      region: config.region
    });
    client.deleteObject(
      {
        Bucket: config.bucket,
        Key: key
      },
      err => {
        if (err) this.setState({ userMessage: err.message });
      }
    );
  };

  /*
   *
   * Handle download of sync object
   *
   */
  handleBackupDownload = key => {
    const { backupProfile, setSyncVersion } = this.props;
    const { config } = backupProfile;

    const client = new S3({
      accessKeyId: config.accessKey,
      secretAccessKey: config.secretKey,
      region: config.region
    });
    client.getObject(
      {
        Bucket: config.bucket,
        Key: key
      },
      (err, data) => {
        if (err) this.setState({ userMessage: err.message });
        else {
          this.deferredCommands.push(() => {
            setSyncVersion(key);
          });
          this.deferredCommands.push(() => {
            this.handleImport();
          });

          this.setState({
            imported: JSON.parse(data.Body.toString('utf-8'))
          });
        }
      }
    );
  };

  /*
   *
   * Upload the sync object to S3
   *
   */
  processBackup = jsonData => {
    const { backupProfile, setSyncVersion } = this.props;
    const { config } = backupProfile;
    const client = new S3({
      accessKeyId: config.accessKey,
      secretAccessKey: config.secretKey,
      region: config.region
    });
    client.upload(
      {
        Bucket: config.bucket,
        Key: `${this.syncLocation}/${new Date().toJSON()}.json`,
        Body: jsonData
      },
      {},
      (err, data) => {
        if (err) this.setState({ userMessage: err.message });
        else {
          this.deferredCommands.push(() => {
            setSyncVersion(data.Key);
          });
          this.setState({
            userMessage: `Auto Saved: ${new Date().toLocaleTimeString()}`
          });
        }
      }
    );
  };

  /*
   *
   * Hydrate the archive state from the filesystem.
   *
   */
  handleHydrateArchiveState = () => {
    getFileContents('user', (err, jsonData) => {
      this.setState({
        user: typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
      });
    });
  };

  /*
   *
   * Persist the Archive State to Storage
   *
   */
  handleBackupPersist = () => {
    const { user } = this.state;
    this.processBackup(JSON.stringify({ user }));
    this.syncs += 1;

    this.setState({
      user: null
    });
  };

  /*
   *
   * When the user is inactive we want to fetch the backups periodically, to make
   * sure that when the user comes back, they have the latest.
   *
   */
  resetActivityInterval = () => {
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
    }
    this.activityTimeout = setTimeout(() => {
      this.setState({ sleeping: true });
    }, 60000);
  };

  /*
   *
   * Populate the redux store with the data from archive state
   *
   */
  handleImport = () => {
    const { loadUser } = this.props;
    const { imported } = this.state;
    const { user } = imported;
    loadUser(user);
  };

  /*
   *
   * Skip the import and overwrite the sync version
   *
   */
  handleSkipSync = () => {
    const { setSyncVersion } = this.props;
    const { backupToRestore } = this.state;
    this.deferredCommands.push(() => {
      setSyncVersion(backupToRestore.Key);
    });
    this.setState({
      backupToRestore: null,
      autoSync: true,
      userMessage: 'Version overwritten'
    });
  };

  /*
   *
   * Apply the latest sync version and data to the
   *
   */
  handleApplySync = () => {
    const { backupToRestore } = this.state;
    this.deferredCommands.push(() => {
      this.handleBackupDownload(backupToRestore.Key);
    });
    this.setState({
      backupToRestore: null,
      autoSync: true,
      userMessage: 'Version applied from sync'
    });
  };

  /*
   *
   * Hide and show the Sync Info modal
   *
   */
  toggleSyncInfo = () => {
    const { showSyncInfo } = this.state;
    this.setState({ showSyncInfo: !showSyncInfo });
  };

  render() {
    const {
      backupToRestore,
      userMessage,
      showSyncInfo,
      autoSync,
      sleeping
    } = this.state;
    const { classes, backupProfile } = this.props;

    return (
      <div>
        <FormControlLabel
          onClick={!backupProfile.verifiedAt ? this.toggleSyncInfo : null}
          className={classes.syncSwitch}
          control={<Switch disabled checked={autoSync} />}
          label={autoSync ? `Sync On: ${userMessage}` : 'Sync Off'}
        />
        {sleeping ? (
          <FormControlLabel
            className={classes.syncSwitch}
            control={
              <CircularProgress
                className={classes.sleeper}
                color="secondary"
                size={20}
                variant="indeterminate"
              />
            }
          />
        ) : null}
        <Dialog open={Boolean(backupToRestore)}>
          <DialogTitle>Sync Data Available</DialogTitle>
          <DialogContent>
            <DialogContentText component="div">
              Pardon the interruption... it appears that your data is a little
              behind.
              <br />
              Perhaps, you were using another device.
              <br />
              <br />
              Would you like to update your data now?
              <br />
              <br />
              <Chip
                avatar={
                  <Avatar>
                    <WarningIcon />
                  </Avatar>
                }
                label="Warning if you skip this update you may lose data"
                variant="outlined"
              />
            </DialogContentText>
            <DialogActions>
              <Button color="secondary" onClick={this.handleSkipSync}>
                No, Skip
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={this.handleApplySync}
              >
                Yes, Apply
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <Dialog open={Boolean(showSyncInfo)}>
          <DialogTitle>Sync Info</DialogTitle>
          <DialogContent>
            <DialogContentText>
              In order to enable sync, you will need to enter in some AWS S3
              credentials. If you do not have an AWS Account or do not
              understand what we are even talking about. Let us know, we can
              help you get setup.
              <br />
              <br />
              See Settings Page under Backup Profile to enter in your
              credentials.
              <br />
              <br />
              See Contact Us on the Help Page to get some help.
            </DialogContentText>
            <DialogActions>
              <Button
                color="primary"
                variant="outlined"
                onClick={this.toggleSyncInfo}
              >
                Ok, I Understand
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

DeviceSync.defaultProps = {
  backupProfile: getBackupProfileStruct()
};

DeviceSync.propTypes = {
  classes: PropType.any.isRequired,
  setSyncVersion: PropType.func.isRequired,
  loadUser: PropType.func.isRequired,
  backupProfile: PropType.any,
  syncVersion: PropType.any.isRequired
};

export default withStyles(style)(DeviceSync);
