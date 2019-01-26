// @flow
import uuidv4 from 'uuid/v4';
import { SET_USER, LOAD_USER_FROM_DISK, SAVE_USER_NOTES } from './types';

export const setUserAction = name => ({
  type: SET_USER,
  payload: {
    id: uuidv4(),
    name
  }
});

export const loadUserFromDiskAction = user => ({
  type: LOAD_USER_FROM_DISK,
  payload: user
});

export const saveUserNotesAction = notes => ({
  type: SAVE_USER_NOTES,
  payload: notes
});
