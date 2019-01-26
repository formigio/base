// @flow
import { SET_SYNC_VERSION, LOAD_SYNC_VERSION_FROM_DISK } from './types';

export const setSyncVersionAction = version => ({
  type: SET_SYNC_VERSION,
  payload: version
});

export const loadSyncVersionFromDiskAction = metadata => ({
  type: LOAD_SYNC_VERSION_FROM_DISK,
  payload: metadata
});
