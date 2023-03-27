import { SET_PRIVATE_COMMENTS, SET_PUBLIC_COMMENTS } from '../actions/commentsActions';

const initialState = {};

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
    default:
      return state;
  }
};

export default commentsReducer;
