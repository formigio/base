import React from 'react';
import { withRouter } from 'react-router';
import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import routes from '../../constants/routes';

class SimpleMenu extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleNavigate = route => () => {
    const { history } = this.props;
    history.push(route);
    this.handleClose();
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <div>
        <Button
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MenuIcon />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem button onClick={this.handleNavigate(`${routes.HOME}`)}>
            Home
          </MenuItem>
          <MenuItem button onClick={this.handleNavigate(`${routes.HELP}`)}>
            Help
          </MenuItem>
          <MenuItem button onClick={this.handleNavigate(`${routes.SETTINGS}`)}>
            Settings
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

SimpleMenu.propTypes = {
  history: PropTypes.any.isRequired
};

export default withRouter(SimpleMenu);
