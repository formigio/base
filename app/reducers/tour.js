import type { Action } from './types';
import {
  SET_TOUR_COMPLETE,
  LOAD_TOUR_FROM_DISK,
  getUserTourStruct,
  getUserToursStruct
} from '../actions/types';

export default function tourReducer(state = [], action: Action) {
  const newState = getUserToursStruct(state);

  switch (action.type) {
    case SET_TOUR_COMPLETE:
      newState.tours[action.payload.id] = getUserTourStruct(action.payload);
      newState.updatedAt = new Date().toString();
      return newState;

    case LOAD_TOUR_FROM_DISK:
      return action.payload;

    default:
      return state;
  }
}
