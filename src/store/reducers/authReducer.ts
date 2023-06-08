import { GET_USER_AUTH, SET_SIGN_OUT, SET_USER_AUTH } from '../actions/authActions';

export enum UserGroup  {
  Unauthenticated = "unauthenticated",
  Authenticated = "authenticated",
  Editor = "editor"
}

const defaultAuthState = {
  userAuth: null,
  username: null,
  userGroup: UserGroup.Unauthenticated
};

function getGroup(userAuth: any) {
  const groups: string[] = userAuth.signInUserSession?.accessToken?.payload['cognito:groups'] || [];
  if (groups.includes(UserGroup.Editor)) {
    return UserGroup.Editor
  }
  if (userAuth?.signInUserSession) {
    return UserGroup.Authenticated
  }
  return UserGroup.Unauthenticated
}

const authReducer = (state = defaultAuthState, action: any) => {
  switch (action.type) {
    case GET_USER_AUTH:
      return state;
    case SET_USER_AUTH:
      const username = action.userAuth.attributes.name;      
      const userGroup = getGroup(action.userAuth)
      return { ...state,  username, userGroup };
    case SET_SIGN_OUT:
      return { ...state, userAuth: null, username: null };
    default:
      return state;
  }
};
export default authReducer;
