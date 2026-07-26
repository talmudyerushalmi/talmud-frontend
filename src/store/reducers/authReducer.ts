import { GET_USER_AUTH, SET_SIGN_OUT, SET_USER_AUTH } from '../actions/authActions';

export enum UserGroup {
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
  if (!userAuth) return UserGroup.Unauthenticated;

  const groups: string[] = 
    userAuth.groups || 
    userAuth.signInUserSession?.accessToken?.payload['cognito:groups'] || 
    [];

  if (groups.includes(UserGroup.Editor)) {
    return UserGroup.Editor;
  }
  return UserGroup.Authenticated;
}

const authReducer = (state = defaultAuthState, action: any) => {
  switch (action.type) {
    case GET_USER_AUTH:
      return state;
    case SET_USER_AUTH: {
      const userAuth = action.userAuth;
      const username = 
        userAuth?.attributes?.name || 
        userAuth?.attributes?.email || 
        userAuth?.username || 
        null;
      const userGroup = getGroup(userAuth);
      return { ...state, userAuth, username, userGroup };
    }
    case SET_SIGN_OUT:
      return { ...state, userAuth: null, username: null, userGroup: UserGroup.Unauthenticated };
    default:
      return state;
  }
};

export default authReducer;