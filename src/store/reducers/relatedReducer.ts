import { iManuscript, iManuscriptPopup } from '../../types/types';
import { SET_MANUSCRIPTS_FOR_CHAPTER,  SET_SUBLINE_DATA } from '../actions/relatedActions';

interface IRelatedState {
  sublineData: iManuscriptPopup | null;
  manuscriptsForChapter: iManuscript[] | null;
}

const initialState: IRelatedState = {
  sublineData: null,
  manuscriptsForChapter: null,
};

const relatedReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SUBLINE_DATA:
      return {
        ...state,
        sublineData: action.payload,
      };
    case SET_MANUSCRIPTS_FOR_CHAPTER:
      return {
        ...state,
        manuscriptsForChapter: action.payload,
      };
    default:
      return state;
  }
};
export default relatedReducer;
