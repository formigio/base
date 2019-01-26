import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styles from './Home.css';

const style = theme => ({
  clock: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  }
});

type Props = {};

class Clock extends Component<Props> {
  props: Props;

  state = {
    time: ''
  };

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  startTimer = () => {
    if (!this.timer) {
      this.timer = setInterval(this.handleSetTime, 3000);
      this.handleSetTime();
    }
  };

  handleSetTime = () => {
    const { time } = this.state;
    const timeString = new Date().toLocaleTimeString();
    const [, median] = timeString.split(' ');
    const [hour, minute] = timeString.split(':');
    const composedTime = [[hour, minute].join(':'), median].join(' ');
    if (time !== composedTime) this.setState({ time: composedTime });
  };

  timer;

  render() {
    const { time } = this.state;
    const { classes } = this.props;

    return (
      <div className={[styles.watch, classes.clock].join(' ')}>
        <span>{time}</span>
      </div>
    );
  }
}

Clock.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(style)(Clock);
