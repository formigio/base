import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from '../components/Home/Home';

type Props = {};

export class HomePageContainer extends Component<Props> {
  props: Props;

  render() {
    return <Home />;
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
