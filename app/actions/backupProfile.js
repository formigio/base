// @flow
import { SET_BACKUP_PROFILE, LOAD_BACKUP_PROFILE_FROM_DISK } from './types';

export const setBackupProfileAction = profile => ({
  type: SET_BACKUP_PROFILE,
  payload: profile
});

export const loadBackupProfileFromDiskAction = profile => ({
  type: LOAD_BACKUP_PROFILE_FROM_DISK,
  payload: profile
});
