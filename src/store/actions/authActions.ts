import { signOut as amplifySignOut, getCurrentUser, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth';

export const GET_USER_AUTH = 'GET_USER_AUTH';
export const SET_USER_AUTH = 'SET_USER_AUTH';
export const SET_SIGN_OUT = 'SET_SIGN_OUT';

export function signOut() {
  return async function (dispatch: any) {
    try {
      await amplifySignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
    dispatch(setSignout());
  };
}

export function getUserAuth() {
  return async function (dispatch: any) {
    try {
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      const session = await fetchAuthSession();
      
      const groups = (session.tokens?.accessToken?.payload['cognito:groups'] as string[]) || [];

      dispatch(setUserAuth({
        username: user.username,
        userId: user.userId,
        attributes,
        groups,
        // תמיכה לאחור במבנה ה-Session
        signInUserSession: {
          accessToken: {
            payload: {
              'cognito:groups': groups
            }
          }
        }
      }));
    } catch (e) {
      // משתמש לא מחובר
    }
  };
}

export const setUserAuth = (userAuth: any) => ({
  type: SET_USER_AUTH,
  userAuth,
});

export const setSignout = () => ({
  type: SET_SIGN_OUT,
});