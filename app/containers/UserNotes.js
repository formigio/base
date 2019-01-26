import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveUserNotesAction } from '../actions/user';
import Notes from '../components/Home/Notes';

type Props = {};

export class UserNotesContainer extends Component<Props> {
  props: Props;

  render() {
    return <Notes />;
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  saveUserNotes: notes => {
    dispatch(saveUserNotesAction(notes));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes);
