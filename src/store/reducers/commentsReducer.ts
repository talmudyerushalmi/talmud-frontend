import {
  SET_COMMENT_MODAL,
  SET_PRIVATE_COMMENTS,
  SET_PUBLIC_COMMENTS,
  SET_SELECTED_COMMENT,
} from '../actions/commentsActions';

const initialState = {
  privateComments: [],
  publicComments: [],
  commentModal: false,
  selectedComment: null,
};

const commentsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_PRIVATE_COMMENTS:
      return {
        ...state,
        privateComments: action.comments,
      };
    case SET_PUBLIC_COMMENTS:
      return {
        ...state,
        publicComments: action.comments,
      };

    case SET_COMMENT_MODAL:
      return {
        ...state,
        commentModal: action.open,
      };
    case SET_SELECTED_COMMENT:
      return {
        ...state,
        selectedComment: action.comment,
        commentModal: !!action.comment,
      };
    default:
      return state;
  }
};

export default commentsReducer;
