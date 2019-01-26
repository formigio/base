// @flow
import { LOAD_TOUR_FROM_DISK, SET_TOUR_COMPLETE } from './types';

export const setTourCompleteAction = userTour => ({
  type: SET_TOUR_COMPLETE,
  payload: userTour
});

export const loadTourFromDiskAction = tour => ({
  type: LOAD_TOUR_FROM_DISK,
  payload: tour
});
