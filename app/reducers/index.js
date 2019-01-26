// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import userReducer from './user';
import backupProfileReducer from './backupProfile';
import tourReducer from './tour';
import syncReducer from './sync';

export default function createRootReducer(history: {}) {
  const routerReducer = connectRouter(history)(() => {});

  return connectRouter(history)(
    combineReducers({
      router: routerReducer,
      user: userReducer,
      backupProfile: backupProfileReducer,
      tour: tourReducer,
      syncVersion: syncReducer
    })
  );
}
