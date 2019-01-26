import uuidv4 from 'uuid/v4';
import type { Action } from './types';
import {
  SET_SYNC_VERSION,
  SyncMetaData,
  LOAD_SYNC_VERSION_FROM_DISK
} from '../actions/types';

export default function syncReducer(oldstate = null, action: Action) {
  switch (action.type) {
    case SET_SYNC_VERSION:
      if (!oldstate.deviceId)
        return Object.assign({}, SyncMetaData, {
          deviceId: uuidv4(),
          currentVersion: action.payload
        });
      return Object.assign({}, SyncMetaData, oldstate, {
        currentVersion: action.payload
      });

    case LOAD_SYNC_VERSION_FROM_DISK:
      return Object.assign({}, SyncMetaData, action.payload);

    default:
      return oldstate;
  }
}
