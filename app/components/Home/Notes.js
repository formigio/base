import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import styles from './Home.css';
import { UserStruct } from '../../actions/types';

const style = theme => ({
  textField: {
    fontSize: 12,
    fontFamily: 'Roboto, sans-serif',
    fontStyle: 'normal',
    display: 'block'
  },
  input: {
    color: '#393939',
    flex: '1 1 auto',
    width: '100%'
  },
  title: {
    color: theme.palette.primary.main
  }
});

type Props = {};

class Notes extends Component<Props> {
  props: Props;

  state = {
    notes: ''
  };

  componentDidMount() {
    const { notes } = this.state;
    const { user } = this.props;

    if (notes !== user.notes) {
      this.fillInNotes(user.notes);
    }
  }

  componentDidUpdate() {
    const { notes } = this.state;
    const { user } = this.props;

    if (user.notes !== notes && this.originalNotes) {
      this.fillInNotes(user.notes);
    }
  }

  originalNotes = true;

  fillInNotes = notes => {
    this.setState({ notes });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    this.originalNotes = false;
    const notes = event.target.value;
    this.deferSave(notes);
  };

  deferSave = debounce(notes => {
    const { saveUserNotes } = this.props;
    saveUserNotes(notes);
  }, 1000);

  render() {
    const { classes, user } = this.props;
    const { notes } = this.state;

    return (
      <div className={`${styles.notes} tour-home-notes`}>
        <span className={[styles.notesLabel, classes.title].join(' ')}>
          Notes / Scratch Pad
        </span>
        <TextField
          id="notes"
          name="notes"
          key={user.id}
          multiline
          value={notes}
          margin="normal"
          placeholder="Makes some notes"
          className={classes.textField}
          InputProps={{
            className: classes.input,
            disableUnderline: true
          }}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

Notes.defaultProps = {
  user: UserStruct,
  saveUserNotes: () => null
};

Notes.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  saveUserNotes: PropTypes.func
};
export default withStyles(style)(Notes);
