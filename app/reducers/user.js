import type { Action } from './types';
import {
  SET_USER,
  LOAD_USER_FROM_DISK,
  SAVE_USER_NOTES,
  UserStruct
} from '../actions/types';
import sync from '../utils/backup/sync';

export default function userReducer(oldstate = null, action: Action) {
  const user = Object.assign({}, oldstate);

  switch (action.type) {
    case SET_USER:
      return Object.assign({}, UserStruct, user, action.payload);

    case LOAD_USER_FROM_DISK:
      return Object.assign({}, UserStruct, action.payload);

    case SAVE_USER_NOTES:
      user.notes = action.payload;
      sync();
      return user;

    default:
      return oldstate;
  }
}
