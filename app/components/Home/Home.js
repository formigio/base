import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styles from './Home.css';
import UserNotes from '../../containers/UserNotes';
import Tour from '../../containers/Tour';
import Clock from './Clock';

const style = theme => ({
  card: {
    marginRight: '17px',
    marginBottom: '1em'
  },
  badge: {
    top: 0,
    right: 0
  },
  welcome: {
    color: theme.palette.secondary.main
  }
});

type Props = {};

class Home extends Component<Props> {
  props: Props;

  state = {};

  render() {
    const { classes, user } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.containerCenter}>
          <div className={styles.contentContainer}>
            <div className={styles.contentContainerRight}>
              <div className={styles.welcomeWrap}>
                <div className={[styles.welcome, classes.welcome].join(' ')}>
                  Welcome Back! {user.name}
                </div>
              </div>
              <UserNotes />
              <Clock />
            </div>
          </div>
        </div>
        <Tour
          id="home-v1.0"
          steps={[
            {
              target: '.tour-home-notes',
              content:
                'Welcome to the Home Page Tour. You can use these tours to ' +
                'teach your users about your application.' +
                'Like this Notes area will save some notes to the user data.'
            }
          ]}
        />
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};
export default withStyles(style)(Home);
