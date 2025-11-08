import { action } from 'typesafe-actions';
import PageService from '../../services/pageService';

export const SET_SYNOPSIS_LIST = 'SET_SYNOPSIS_LIST';

export const fetchSynopsisList = () => {
  return async (dispatch) => {
    try {
      const synopsisList = await PageService.getSynopsisList();
      return dispatch(action(SET_SYNOPSIS_LIST, synopsisList));
    } catch (error) {
      console.error('Error fetching synopsis list:', error);
      // Return empty object on error to prevent app from breaking
      return dispatch(action(SET_SYNOPSIS_LIST, {}));
    }
  };
};

