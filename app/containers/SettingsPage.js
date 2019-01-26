import React, { Component } from 'react';
import { connect } from 'react-redux';
import Settings from '../components/Settings/Settings';
import { loadUserFromDiskAction } from '../actions/user';
import { setBackupProfileAction } from '../actions/backupProfile';
import { loadTourFromDiskAction } from '../actions/tour';

type Props = {};

export class SettingsPageContainer extends Component<Props> {
  props: Props;

  render() {
    return <Settings />;
  }
}

const mapStateToProps = state => ({
  user: state.user,
  backupProfile: state.backupProfile
});

const mapDispatchToProps = dispatch => ({
  loadUser: user => {
    dispatch(loadUserFromDiskAction(user));
  },
  setBackupProfile: profile => {
    dispatch(setBackupProfileAction(profile));
  },
  resetTours: tour => {
    dispatch(loadTourFromDiskAction(tour));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
