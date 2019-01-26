import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const style = () => ({});

type Props = {};

class HoverButton extends Component<Props> {
  props: Props;

  state = { hover: false };

  handleMouseOut = () => {
    this.setState({ hover: false });
  };

  handleMouseOver = () => {
    this.setState({ hover: true });
  };

  render() {
    const { ...props } = this.props;
    const { children, hoverContent } = this.props;
    const { hover } = this.state;
    delete props.hoverContent;
    return (
      <Button
        {...props}
        onMouseOut={this.handleMouseOut}
        onBlur={this.handleMouseOut}
        onMouseOver={this.handleMouseOver}
        onFocus={this.handleMouseOver}
      >
        {hover ? hoverContent : children}
      </Button>
    );
  }
}

HoverButton.defaultProps = {};

HoverButton.propTypes = {
  children: PropTypes.any.isRequired,
  hoverContent: PropTypes.any.isRequired
};

export default withStyles(style)(HoverButton);
