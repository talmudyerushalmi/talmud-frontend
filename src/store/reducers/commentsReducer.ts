const initialState = {};

const commentsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_PRIVATE_COMMENTS':
      return {
        ...state,
        privateComments: action.comments,
      };
    default:
      return state;
  }
};

export default commentsReducer;
