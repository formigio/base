import React, { Component } from 'react';
import Help from '../components/Help/Help';

type Props = {};

export class HelpPageContainer extends Component<Props> {
  props: Props;

  render() {
    return <Help />;
  }
}

export default Help;
