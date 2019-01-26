import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import DeviceSync from '../../containers/Backup/Sync';

const styles = theme => ({
  appBar: {
    top: 'auto',
    bottom: 0,
    backgroundColor: theme.palette.secondary.dark
  },
  toolBar: {
    minHeight: 40,
    color: theme.palette.secondary.contrastText,
    justifyContent: 'space-between'
  },
  overline: {
    color: theme.palette.secondary.contrastText
  }
});

type Props = {};

class BottomBar extends Component<Props> {
  props: Props;

  state = {};

  render() {
    const { classes } = this.props;
    return (
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <Typography variant="overline" className={classes.overline}>
            Formigio Base
          </Typography>
          <DeviceSync />
        </Toolbar>
      </AppBar>
    );
  }
}
BottomBar.propTypes = {
  classes: PropTypes.any.isRequired
};

export default withStyles(styles)(BottomBar);
