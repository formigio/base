import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import PropType from 'prop-types';
import S3 from 'aws-sdk/clients/s3';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import Divider from '@material-ui/core/Divider/Divider';
import Input from '@material-ui/core/Input/Input';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';
import Chip from '@material-ui/core/Chip';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Avatar from '@material-ui/core/Avatar';
import InputAdornment from '@material-ui/core/InputAdornment';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { getFileContents } from '../../utils/localStorage';
import Style from './Style';
import styles from './Settings.css';
import {
  getBackupProfileStruct,
  getS3BackupConfigStruct,
  getUserToursStruct
} from '../../actions/types';

type Props = {};

class Settings extends Component<Props> {
  props: Props;

  state = {
    user: null,
    fileImport: false,
    imported: {
      user: null
    },
    localBackupProfile: getBackupProfileStruct(),
    backupConfig: getS3BackupConfigStruct(),
    backups: [],
    userMessage: '',
    saving: false
  };

  componentDidMount() {
    this.hydrateState();
  }

  componentDidUpdate() {
    this.hydrateState();
    this.checkDeferredCommands();
  }

  // List of commands to run after render.
  deferredCommands = [];

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

  hydrateState = () => {
    const { backupProfile } = this.props;
    const { localBackupProfile } = this.state;
    if (localBackupProfile.updatedAt !== backupProfile.updatedAt)
      this.setState({
        localBackupProfile: getBackupProfileStruct(backupProfile),
        backupConfig: getS3BackupConfigStruct(backupProfile.config)
      });
  };

  handleBackupFetch = () => {
    const { backupConfig, localBackupProfile } = this.state;
    const { setBackupProfile } = this.props;
    const client = new S3({
      accessKeyId: backupConfig.accessKey,
      secretAccessKey: backupConfig.secretKey,
      region: backupConfig.region
    });
    client.listObjectsV2(
      {
        Bucket: backupConfig.bucket,
        Prefix: backupConfig.location,
        FetchOwner: false,
        MaxKeys: 20
      },
      (err, data) => {
        if (err) {
          localBackupProfile.verifiedAt = '';
          this.deferredCommands.push(() => {
            setBackupProfile(localBackupProfile);
          });
          this.setState({ saving: false, userMessage: err.message });
        } else {
          localBackupProfile.verifiedAt = new Date().toString();
          this.deferredCommands.push(() => {
            setBackupProfile(localBackupProfile);
          });
          this.setState({
            saving: false,
            backups: data.Contents
          });
        }
      }
    );
  };

  handleBackupDownload = key => () => {
    const { backupConfig } = this.state;
    const client = new S3({
      accessKeyId: backupConfig.accessKey,
      secretAccessKey: backupConfig.secretKey,
      region: backupConfig.region
    });
    client.getObject(
      {
        Bucket: backupConfig.bucket,
        Key: key
      },
      (err, data) => {
        if (err) this.setState({ userMessage: err.message });
        else {
          this.setState({
            imported: JSON.parse(data.Body.toString('utf-8'))
          });
        }
      }
    );
  };

  handleBackupDelete = key => () => {
    const { backupConfig } = this.state;
    const client = new S3({
      accessKeyId: backupConfig.accessKey,
      secretAccessKey: backupConfig.secretKey,
      region: backupConfig.region
    });
    client.deleteObject(
      {
        Bucket: backupConfig.bucket,
        Key: key
      },
      err => {
        if (err) this.setState({ userMessage: err.message });
        else this.handleBackupFetch();
      }
    );
  };

  processBackup = jsonData => {
    const { backupConfig } = this.state;
    const client = new S3({
      accessKeyId: backupConfig.accessKey,
      secretAccessKey: backupConfig.secretKey,
      region: backupConfig.region
    });
    client.upload(
      {
        Bucket: backupConfig.bucket,
        Key: `${backupConfig.location}/${new Date().toJSON()}.json`,
        Body: jsonData
      },
      {},
      (err, data) => {
        if (err) this.setState({ userMessage: err.message });
        else
          this.setState({ userMessage: `Archive Saved to S3 as: ${data.Key}` });
      }
    );
  };

  processDownload = (jsonData, filename) => {
    const blob = new Blob([jsonData], { type: 'application/json' });

    const dataURI = `data:application/json;charset=utf-8,${jsonData}`;

    const URL = window.URL || window.webkitURL;
    const downloadURI =
      typeof URL.createObjectURL === 'undefined'
        ? dataURI
        : URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', downloadURI);
    link.setAttribute('download', `${filename}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  handleDownload = type => {
    getFileContents(type, (err, jsonData) => {
      this.processDownload(jsonData, type);
    });
  };

  handleUserDownload = () => {
    this.handleDownload('user');
  };

  handleCreateArchive = () => {
    getFileContents('user', (err, jsonData) => {
      this.setState({
        user: typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
      });
    });
  };

  handleAllDownload = () => {
    const { user } = this.state;
    this.processDownload(JSON.stringify({ user }), 'formigio-archive');
    this.setState({
      user: null
    });
  };

  handleAllBackup = () => {
    const { user } = this.state;
    this.processBackup(JSON.stringify({ user }));
    this.setState({
      user: null
    });
  };

  handleFileSelect = () => {
    this.setState({ fileImport: true });
  };

  handleFileRead = e => {
    const importData = JSON.parse(e.target.result);
    this.setState({
      imported: importData
    });
  };

  handleFile = e => {
    const fileReader = new FileReader();
    fileReader.onload = this.handleFileRead;
    fileReader.readAsText(e.target.files[0]);
  };

  handleImport = () => {
    const { loadUser } = this.props;
    const { imported } = this.state;
    const { user } = imported;
    loadUser(user);
    this.handleImportCancel();
  };

  handleImportCancel = () => {
    this.setState({
      fileImport: false,
      imported: {
        user: null
      }
    });
  };

  handleArchiveCancel = () => {
    this.setState({
      user: null
    });
  };

  handleBackupProfileSave = () => {
    const { localBackupProfile, backupConfig } = this.state;
    const { setBackupProfile } = this.props;
    this.deferredCommands.push(() => {
      this.handleBackupFetch();
    });
    this.deferredCommands.push(() => {
      localBackupProfile.config = backupConfig;
      setBackupProfile(localBackupProfile);
    });
    this.setState({ saving: true });
  };

  handleBackupProfileChange = event => {
    const { backupConfig } = this.state;
    backupConfig[event.target.name] = event.target.value;
    this.setState({ backupConfig });
  };

  handleTourReset = () => {
    const { resetTours } = this.props;
    resetTours(getUserToursStruct({ updatedAt: new Date().toString() }));
  };

  render() {
    const {
      user,
      fileImport,
      imported,
      backupConfig,
      userMessage,
      backups,
      saving
    } = this.state;
    const { backupProfile } = this.props;

    return (
      <div className={styles.contentContainer}>
        <div className={styles.settingsContainer}>
          <div>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Data Import/Export</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Card className={styles.card}>
                  <CardHeader
                    title="Application Data"
                    subheader="Export and Import Data"
                  />
                  <CardContent>
                    <List>
                      <ListItem button onClick={this.handleUserDownload}>
                        <ListItemText primary="Download User Settings" />
                      </ListItem>
                      <Divider />
                      <ListItem button onClick={this.handleCreateArchive}>
                        <ListItemText primary="Create Complete Archive" />
                      </ListItem>
                      <Divider />
                      <ListItem button onClick={this.handleFileSelect}>
                        <ListItemText primary="Import From Archive" />
                        {fileImport ? (
                          <List>
                            <ListItem>
                              <Input type="file" onChange={this.handleFile} />
                            </ListItem>
                          </List>
                        ) : null}
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
          <div>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Backup Profile</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Card>
                  <CardHeader
                    title="Backup Profile"
                    subheader="Backup up data to AWS S3"
                  />
                  <CardContent>
                    <TextField
                      id="configAccessKey"
                      key="configAccessKey"
                      name="accessKey"
                      label="AWS Access Key"
                      onChange={this.handleBackupProfileChange}
                      value={backupConfig.accessKey}
                      fullWidth
                    />
                    <TextField
                      id="configSecretKey"
                      key="configSecretKey"
                      type="password"
                      name="secretKey"
                      label="AWS Secret Key"
                      onChange={this.handleBackupProfileChange}
                      value={backupConfig.secretKey}
                      fullWidth
                    />
                    <TextField
                      id="configBucket"
                      key="configBucket"
                      name="bucket"
                      label="S3 Bucket Name"
                      onChange={this.handleBackupProfileChange}
                      value={backupConfig.bucket}
                      fullWidth
                    />
                    <TextField
                      id="configRegion"
                      key="configRegion"
                      name="region"
                      label="S3 Bucket Region"
                      onChange={this.handleBackupProfileChange}
                      value={backupConfig.region}
                      fullWidth
                    />
                    <TextField
                      id="configLocation"
                      key="configLocation"
                      name="location"
                      label="Backup Location/Path"
                      onChange={this.handleBackupProfileChange}
                      value={backupConfig.location}
                      fullWidth
                    />
                    <TextField
                      id="verifiedAt"
                      key="verifiedAt"
                      label="Profile Verified"
                      value={backupProfile.verifiedAt}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {backupProfile.verifiedAt ? (
                              <CheckCircleIcon />
                            ) : (
                              <React.Fragment />
                            )}
                          </InputAdornment>
                        )
                      }}
                    />
                    <div className={styles.buttonWrap}>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={saving}
                        onClick={this.handleBackupProfileSave}
                      >
                        Save Profile
                      </Button>
                    </div>
                    <Fade in={Boolean(userMessage)}>
                      <Chip
                        avatar={
                          <Avatar>
                            <ErrorIcon />
                          </Avatar>
                        }
                        label={userMessage}
                      />
                    </Fade>
                  </CardContent>
                </Card>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
          <div>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Backups</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Card>
                  <CardHeader
                    title="Backups"
                    subheader="Manage backed up data in S3"
                  />
                  <CardContent>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleBackupFetch}
                    >
                      Fetch Backups from S3
                    </Button>
                    <List>
                      {backups.length
                        ? backups.map(backup => (
                            <ListItem key={backup.Key}>
                              <ListItemText primary={backup.Key} />
                              <ListItemSecondaryAction>
                                <IconButton
                                  onClick={this.handleBackupDownload(
                                    backup.Key
                                  )}
                                >
                                  <CloudDownloadIcon />
                                </IconButton>
                                <IconButton
                                  onClick={this.handleBackupDelete(backup.Key)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))
                        : null}
                    </List>
                  </CardContent>
                </Card>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
          <div>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Tours</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Card>
                  <CardHeader
                    title="Tours & Help Content"
                    subheader="Manage your help settings"
                  />
                  <CardContent>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleTourReset}
                    >
                      Reset All Tours
                    </Button>
                  </CardContent>
                </Card>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
          <Dialog open={Boolean(imported.user && imported.user.id)}>
            <DialogTitle>Process Import</DialogTitle>
            <DialogContent>
              <List>
                <ListItem>
                  <ListItemText
                    primary={`User found: ${
                      imported.user ? imported.user.id : ''
                    }`}
                  />
                </ListItem>
              </List>
              <Typography>
                WARNING: Importing an archive will replace all the data in the
                app. Please make sure you have downloaded an archive prior to
                importing.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleImportCancel} color="secondary">
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={this.handleImport}
              >
                Process Import
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={Boolean(user)}>
            <DialogTitle>Archive Data</DialogTitle>
            <DialogContent>
              You can download the Archive or Push the Archive to S3 as a
              backup. These S3 backups can be imported back in from the Backups
              list.
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleArchiveCancel} color="secondary">
                Cancel
              </Button>
              <Button
                color="primary"
                variant="outlined"
                onClick={this.handleAllDownload}
              >
                Download Archive
              </Button>
              <Button
                color="primary"
                variant="outlined"
                onClick={this.handleAllBackup}
              >
                Backup Archive
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            key="userMessage"
            autoHideDuration={6000}
            open={Boolean(userMessage)}
            message={userMessage}
            onClose={() => this.setState({ userMessage: null })}
          />
        </div>
      </div>
    );
  }
}

Settings.defaultProps = {
  backupProfile: getBackupProfileStruct()
};

Settings.propTypes = {
  loadUser: PropType.func.isRequired,
  setBackupProfile: PropType.func.isRequired,
  resetTours: PropType.func.isRequired,
  backupProfile: PropType.any
};

export default withStyles(Style)(Settings);
