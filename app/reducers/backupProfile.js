import type { Action } from './types';
import {
  getBackupProfileStruct,
  LOAD_BACKUP_PROFILE_FROM_DISK,
  SET_BACKUP_PROFILE
} from '../actions/types';

export default function backupProfileReducer(oldstate = null, action: Action) {
  let profile;
  switch (action.type) {
    case SET_BACKUP_PROFILE:
      profile = getBackupProfileStruct(action.payload);
      profile.updatedAt = new Date().toString();
      return profile;

    case LOAD_BACKUP_PROFILE_FROM_DISK:
      return getBackupProfileStruct(action.payload);

    default:
      return oldstate;
  }
}
