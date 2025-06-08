import { action } from 'typesafe-actions';
import { tryAsyncWithLoadingState } from './actionHelpers';
import { SearchService } from '../../services/search.service';
import { Dispatch } from 'redux';

export const SEARCH_TEXT = 'SEARCH_TEXT';

export const searchText = (data: string) => {
  return async function (dispatch: Dispatch, getState) {
    const res = await tryAsyncWithLoadingState(dispatch, SearchService.searchText(data));
    return dispatch(action(SEARCH_TEXT, res));
  };
};
