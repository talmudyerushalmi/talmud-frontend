import { SEARCH_TEXT } from '../actions/searchActions';
import { RawDraftContentState } from 'draft-js';

const initialState = {
  searchResults: [],
};

export interface ISearchResult {
  guid: string;
  lineNumber: string;
  sublineIndex: number;
  nosach: RawDraftContentState;
}

export interface SearchState {
  searchResults: ISearchResult[];
}

export const searchReducer = (state = initialState, action): SearchState => {
  switch (action.type) {
    case SEARCH_TEXT:
      return {
        ...state,
        searchResults: action.payload,
      };
    default:
      return state;
  }
};
