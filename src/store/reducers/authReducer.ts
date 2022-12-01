import { GET_USER_AUTH, SET_SIGN_OUT, SET_USER_AUTH } from '../actions/authActions';

const defaultAuthState = {
  userAuth: null,
  username: null,
};

const authReducer = (state = defaultAuthState, action: any) => {
  switch (action.type) {
    case GET_USER_AUTH:
      return state;
    case SET_USER_AUTH:
      const username = action.userAuth.attributes.name;      
      return { ...state,  username };
    case SET_SIGN_OUT:
      return { ...state, userAuth: null, username: null };
    default:
      return state;
  }
};
export default authReducer;
