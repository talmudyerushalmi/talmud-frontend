import { GET_USER_AUTH, SET_ANONYMOUS, SET_SIGN_OUT, SET_USER_AUTH } from '../actions/authActions';

export enum UserGroup {
  /**
   * Initial state on page load, BEFORE `getUserAuth` has finished talking to
   * Cognito. Routing guards MUST treat this as "don't decide yet" — redirecting
   * to /login here is the bug that kicks signed-in editors off admin pages on
   * refresh. Transitions to `Unauthenticated` (anonymous) or
   * `Authenticated`/`Editor` (signed in) once auth is resolved.
   */
  Unknown = 'unknown',
  Unauthenticated = 'unauthenticated',
  Authenticated = 'authenticated',
  Editor = 'editor',
}

const defaultAuthState = {
  userAuth: null,
  username: null,
  userGroup: UserGroup.Unknown,
};

function getGroup(userAuth: any) {
  if (!userAuth) return UserGroup.Unauthenticated;

  const groups: string[] = userAuth.groups || [];

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
      const username = userAuth?.attributes?.name || userAuth?.attributes?.email || userAuth?.username || null;
      const userGroup = getGroup(userAuth);
      return { ...state, userAuth, username, userGroup };
    }
    case SET_SIGN_OUT:
    case SET_ANONYMOUS:
      // Both land on the same anonymous state. We keep two action names so the
      // intent is explicit at the dispatch site: SET_SIGN_OUT = user clicked
      // "sign out"; SET_ANONYMOUS = initial auth probe resolved as "not signed in".
      return { ...state, userAuth: null, username: null, userGroup: UserGroup.Unauthenticated };
    default:
      return state;
  }
};

export default authReducer;
