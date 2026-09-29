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
  /** When the matched line lives in a split halacha, this is the 1-based part index.
   *  Absent for non-split (passthrough or unified) halachas. */
  part?: number;
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
