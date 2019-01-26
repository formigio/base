import React, { Component } from 'react';
import { connect } from 'react-redux';
import DeviceSync from '../../components/Settings/DeviceSync';
import { loadUserFromDiskAction } from '../../actions/user';
import { setSyncVersionAction } from '../../actions/sync';

type Props = {};

export class BackupSyncContainer extends Component<Props> {
  props: Props;

  render() {
    return <DeviceSync />;
  }
}

const mapStateToProps = state => ({
  backupProfile: state.backupProfile,
  syncVersion: state.syncVersion
});

const mapDispatchToProps = dispatch => ({
  loadUser: user => {
    dispatch(loadUserFromDiskAction(user));
  },
  setSyncVersion: version => {
    dispatch(setSyncVersionAction(version));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceSync);
