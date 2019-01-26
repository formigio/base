import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import UserNotes from '../../containers/UserNotes';
import Tour from '../../containers/Tour';
import Clock from './Clock';

const style = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  welcome: {
    color: theme.palette.secondary.main
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%'
  }
});
type Props = {};

class Home extends Component<Props> {
  props: Props;

  state = {};

  render() {
    const { classes, user } = this.props;

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={1}>
          <Typography variant="h5" component="h3">
            <div className={[classes.welcome].join(' ')}>
              Welcome Back! {user.name}
            </div>
          </Typography>
          <Typography component="p">
            <Clock />
          </Typography>
        </Paper>
        <Paper className={classes.root} elevation={1}>
          <Typography component="p">
            <UserNotes />
          </Typography>
        </Paper>
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
