// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import { withStyles } from '@material-ui/core/styles';
import { UserStruct } from '../../actions/types';
import styles from './Login.css';
import Style from './Style';

type Props = {};

class Login extends Component<Props> {
  props: Props;

  state = {
    name: '',
    done: false,
    activeStep: 0,
    showStepper: false,
    showHeader: false,
    waitTime: 4000,
    showContinue: false
  };

  componentDidMount(): void {
    setTimeout(this.progressShowHeader, 1500);
  }

  componentWillUnmount(): void {
    clearInterval(this.stepTimer);
  }

  stepTimer = null;

  welcomeSteps = {
    1: {
      step: '1',
      title: 'This is a welcome page',
      content: 'You can use this to teach/reminder people about stuff.'
    },
    3: {
      step: '2',
      title: 'In Formigio Base, there is a help page',
      content: 'Where you can explain the features of the application'
    },
    4: {
      step: '4',
      title: 'There is also a settings area',
      content: 'Where you can store user based settings.'
    },
    5: {
      step: '5',
      title: 'There are tours built in',
      content:
        'This is great for teaching users about specific features as th' +
        'are released.'
    }
  };

  progressShowHeader = () => {
    this.setState({ showHeader: true });
    setTimeout(this.progressShowStepper, 1000);
  };

  progressShowStepper = () => {
    const { waitTime } = this.state;
    this.stepTimer = setInterval(this.progressWelcomeStep, waitTime);
    this.setState({ showStepper: true, showContinue: true, waitTime: 3200 });
  };

  progressWelcomeStep = () => {
    const { activeStep } = this.state;
    if (activeStep < Object.keys(this.welcomeSteps).length) {
      this.setState({ activeStep: activeStep + 1 });
    } else if (activeStep === this.welcomeSteps.length) {
      clearInterval(this.stepTimer);
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleLogin();
    }
  };

  handleLogin = () => {
    let { name } = this.state;
    const { setUser, user } = this.props;
    const { name: userName } = user;

    if (userName !== '') {
      name = userName;
    }

    setUser(name);

    this.setState({
      done: true
    });
  };

  render() {
    const { classes, user } = this.props;
    const {
      name,
      done,
      activeStep,
      showStepper,
      showHeader,
      showContinue
    } = this.state;

    if (done === true) {
      return <Redirect to="/home" />;
    }

    // If we already have a user record.
    const greeting =
      user.id === '' ? <div>Hello and welcome!</div> : <div>Welcome back!</div>;

    const continueAction = (
      <Fade in={showContinue}>
        <Button variant="contained" color="primary" onClick={this.handleLogin}>
          Continue to your Home Page
        </Button>
      </Fade>
    );

    const loginAction = (
      <div>
        <TextField
          id="standard-name"
          label="Enter Your Name"
          autoFocus
          className={classes.textField}
          InputProps={{
            className: classes.input
          }}
          value={name}
          onChange={this.handleChange('name')}
          onKeyPress={this.handleKeyPress}
          margin="normal"
        />
        <div>
          <Fade in={Boolean(name)}>
            <Button
              variant="contained"
              disabled={!name}
              color="primary"
              onClick={this.handleLogin}
            >
              Get Started
            </Button>
          </Fade>
        </div>
      </div>
    );

    return (
      <div className={styles.container} data-tid="container">
        <div className={styles.logoContainer}>
          <Fade in>
            <Typography variant="h5" color="secondary">
              {greeting}
            </Typography>
          </Fade>
          <Fade in={showHeader}>
            <Typography variant="h6" color="secondary">
              {"Let's review how we can use Formigio Base"}
            </Typography>
          </Fade>
          <Fade in={showStepper}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {Object.keys(this.welcomeSteps).map(stepNumber => {
                const step = this.welcomeSteps[stepNumber];
                return (
                  <Step key={step.step}>
                    <StepLabel>{step.title}</StepLabel>
                    <StepContent transitionDuration={650}>
                      {step.content}
                    </StepContent>
                  </Step>
                );
              })}
            </Stepper>
          </Fade>
          {user.id === '' &&
          Object.keys(this.welcomeSteps).length === activeStep
            ? loginAction
            : null}
          {user.id !== '' ? continueAction : null}
        </div>
      </div>
    );
  }
}

Login.defaultProps = {
  user: UserStruct,
  setUser: () => null
};

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  setUser: PropTypes.func
};

export default withStyles(Style)(Login);
