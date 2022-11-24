import { iManuscriptPopup } from '../../types/types';
import { SET_RELEVANT_MANUSCRIPT } from '../actions/relatedActions';

interface IRelatedState {
  relevantManuscript: iManuscriptPopup | null;
}

const initialState: IRelatedState = {
  relevantManuscript: null,
};

const relatedReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RELEVANT_MANUSCRIPT:
      return {
        ...state,
        relevantManuscript: action.payload,
      };
    default:
      return state;
  }
};
export default relatedReducer;
