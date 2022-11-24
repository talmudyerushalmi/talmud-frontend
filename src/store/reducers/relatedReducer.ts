import { iManuscript, iManuscriptPopup } from '../../types/types';
import { SET_MANUSCRIPTS_FOR_CHAPTER, SET_RELEVANT_MANUSCRIPT } from '../actions/relatedActions';

interface IRelatedState {
  relevantManuscript: iManuscriptPopup | null;
  manuscriptsForChapter: iManuscript[] | null;
}

const initialState: IRelatedState = {
  relevantManuscript: null,
  manuscriptsForChapter: null,
};

const relatedReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RELEVANT_MANUSCRIPT:
      return {
        ...state,
        relevantManuscript: action.payload,
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
