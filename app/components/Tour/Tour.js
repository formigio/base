import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Joyride from 'react-joyride';
import { EVENTS } from 'react-joyride/es';
import { getUserTourStruct } from '../../actions/types';

type Props = {};

class Tour extends Component<Props> {
  props: Props;

  state = {
    show: false
  };

  componentDidMount() {
    this.timeout = setTimeout(this.handleRevealTour, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  timeout;

  handleRevealTour = () => {
    this.setState({ show: true });
  };

  handleTourChange = tour => {
    const { setTourComplete, id } = this.props;
    const { type } = tour;
    if (type === EVENTS.TOUR_END) {
      setTourComplete(getUserTourStruct({ id, status: 'complete' }));
    }
  };

  render() {
    const {
      steps,
      tour,
      id,
      continuous,
      run,
      zIndex,
      disableScrolling
    } = this.props;
    const { show } = this.state;

    if (!show) return null;

    if (tour.tours[id] && tour.tours[id].status === 'complete') {
      return null;
    }

    return (
      <Joyride
        run={run}
        continuous={continuous}
        callback={this.handleTourChange}
        disableScrolling={disableScrolling}
        steps={steps}
        floaterProps={{
          styles: {
            wrapper: {
              zIndex
            }
          }
        }}
        styles={{
          options: {
            zIndex
          }
        }}
      />
    );
  }
}

Tour.defaultProps = {
  continuous: true,
  run: true,
  zIndex: 100,
  disableScrolling: true
};

Tour.propTypes = {
  id: PropTypes.any.isRequired,
  tour: PropTypes.any.isRequired,
  steps: PropTypes.any.isRequired,
  setTourComplete: PropTypes.func.isRequired,
  continuous: PropTypes.any,
  run: PropTypes.any,
  zIndex: PropTypes.any,
  disableScrolling: PropTypes.bool
};
export default Tour;
