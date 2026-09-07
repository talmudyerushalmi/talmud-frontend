import { signOut as amplifySignOut, getCurrentUser, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth';

export const GET_USER_AUTH = 'GET_USER_AUTH';
export const SET_USER_AUTH = 'SET_USER_AUTH';
export const SET_SIGN_OUT = 'SET_SIGN_OUT';

export function signOut() {
  return async function (dispatch: any) {
    try {
      await amplifySignOut();
    } catch {
      // Ignore Amplify errors and still clear local auth state below,
      // so the UI never gets stuck on a "signing out" state.
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

      dispatch(
        setUserAuth({
          username: user.username,
          userId: user.userId,
          attributes,
          groups,
        })
      );
    } catch {
      // Not signed in — nothing to dispatch. Left silent on purpose:
      // `getUserAuth` is called eagerly on mount and it's expected to
      // reject for anonymous users.
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
