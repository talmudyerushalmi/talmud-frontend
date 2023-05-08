import { CommentModal, SET_COMMENT_MODAL, SET_PRIVATE_COMMENTS, SET_SELECTED_COMMENT } from '../actions/commentsActions';

const initialState = {
  privateComments: [],
  commentModal: null,
  selectedComment: null,
};

const commentsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_PRIVATE_COMMENTS:
      return {
        ...state,
        privateComments: action.comments,
      };
    case SET_COMMENT_MODAL:
      return {
        ...state,
        commentModal: action.payload,
      };
    case SET_SELECTED_COMMENT:
      return {
        ...state,
        selectedComment: action.comment,
        commentModal: { open: CommentModal.EDIT },
      };
    default:
      return state;
  }
};

export default commentsReducer;
