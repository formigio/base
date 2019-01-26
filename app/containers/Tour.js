import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setTourCompleteAction } from '../actions/tour';
import Tour from '../components/Tour/Tour';

type Props = {};

export class TourContainer extends Component<Props> {
  props: Props;

  render() {
    return <Tour />;
  }
}

const mapStateToProps = state => ({
  tour: state.tour
});

const mapDispatchToProps = dispatch => ({
  setTourComplete: tour => {
    dispatch(setTourCompleteAction(tour));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tour);
