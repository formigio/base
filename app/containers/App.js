// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadState } from '../utils/localStorage';
import { loadUserFromDiskAction } from '../actions/user';
import { loadBackupProfileFromDiskAction } from '../actions/backupProfile';
import { loadTourFromDiskAction } from '../actions/tour';
import { loadSyncVersionFromDiskAction } from '../actions/sync';

type Props = {
  children: React.Node
};

export class App extends React.Component<Props> {
  props: Props;

  // Here we fire off a one time per app load data fetch.
  componentDidMount() {
    // Fetch function from properties
    const {
      loadUserFromDisk,
      loadBackupProfileFromDisk,
      loadTourFromDisk,
      loadSyncVersionFromDisk
    } = this.props;

    // Call the Util Local Storage loadState function which pulls the trackers
    // from the local storage if cached there, if not it pulls from the disk
    loadState('user', (err, serializedState) => {
      if (
        serializedState === null ||
        (typeof serializedState === 'object' &&
          Object.keys(serializedState).length === 0)
      ) {
        return;
      }

      // Serialized State from the localStorage or disk is parsed
      const user = JSON.parse(serializedState);

      // Check if we have any issues with JSON parse, or errors from the fetch
      if (err || user === null || user === undefined) {
        return;
      }

      // Dispatch the action to push data through the reducers
      loadUserFromDisk(user);
    });
    loadState('backupProfile', (err, serializedState) => {
      if (
        serializedState === null ||
        (typeof serializedState === 'object' &&
          Object.keys(serializedState).length === 0)
      ) {
        return;
      }

      // Serialized State from the localStorage or disk is parsed
      const backupProfile = JSON.parse(serializedState);

      // Check if we have any issues with JSON parse, or errors from the fetch
      if (err || backupProfile === null || backupProfile === undefined) {
        return;
      }

      // Dispatch the action to push data through the reducers
      loadBackupProfileFromDisk(backupProfile);
    });
    loadState('tour', (err, serializedState) => {
      if (
        serializedState === null ||
        (typeof serializedState === 'object' &&
          Object.keys(serializedState).length === 0)
      ) {
        return;
      }

      // Serialized State from the localStorage or disk is parsed
      const tour = JSON.parse(serializedState);

      // Check if we have any issues with JSON parse, or errors from the fetch
      if (err || tour === null || tour === undefined) {
        return;
      }

      // Dispatch the action to push data through the reducers
      loadTourFromDisk(tour);
    });
    loadState('syncVersion', (err, serializedState) => {
      if (
        serializedState === null ||
        (typeof serializedState === 'object' &&
          Object.keys(serializedState).length === 0)
      ) {
        return;
      }

      // Serialized State from the localStorage or disk is parsed
      const syncVersion = JSON.parse(serializedState);

      // Check if we have any issues with JSON parse, or errors from the fetch
      if (err || syncVersion === null || syncVersion === undefined) {
        return;
      }

      // Dispatch the action to push data through the reducers
      loadSyncVersionFromDisk(syncVersion);
    });
  }

  render() {
    const { children } = this.props;
    return <React.Fragment>{children}</React.Fragment>;
  }
}

// Define Default Props for ESLint
App.defaultProps = {};

// Define Default Prop Type for ESLint
App.propTypes = {
  loadUserFromDisk: PropTypes.func.isRequired,
  loadBackupProfileFromDisk: PropTypes.func.isRequired,
  loadTourFromDisk: PropTypes.func.isRequired,
  loadSyncVersionFromDisk: PropTypes.func.isRequired
};

// Map the functions to dispatch for actions
const mapDispatchToProps = dispatch => ({
  loadUserFromDisk: user => {
    dispatch(loadUserFromDiskAction(user));
  },
  loadBackupProfileFromDisk: profile => {
    dispatch(loadBackupProfileFromDiskAction(profile));
  },
  loadTourFromDisk: tour => {
    dispatch(loadTourFromDiskAction(tour));
  },
  loadSyncVersionFromDisk: metadata => {
    dispatch(loadSyncVersionFromDiskAction(metadata));
  }
});

// Connect the dots for the App component
export default connect(
  null,
  mapDispatchToProps
)(App);
