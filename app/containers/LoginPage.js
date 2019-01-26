// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserAction } from '../actions/user';
import Login from '../components/Login/Login';

type Props = {};

export class LoginPageContainer extends Component<Props> {
  props: Props;

  render() {
    return <Login />;
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  setUser: name => {
    dispatch(setUserAction(name));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
