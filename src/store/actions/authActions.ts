import { signOut as amplifySignOut, getCurrentUser, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth';

export const GET_USER_AUTH = 'GET_USER_AUTH';
export const SET_USER_AUTH = 'SET_USER_AUTH';
export const SET_SIGN_OUT = 'SET_SIGN_OUT';
/**
 * Fired when `getUserAuth`'s probe to Cognito completes but finds no signed-in
 * user. Transitions auth state from `Unknown` → `Unauthenticated` so routing
 * guards (RequireAuth) can finally make a decision.
 */
export const SET_ANONYMOUS = 'SET_ANONYMOUS';

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
      // Not signed in. Dispatch SET_ANONYMOUS so the reducer can move auth
      // state out of `Unknown` — otherwise RequireAuth would sit on a blank
      // page forever for genuinely anonymous visitors to protected routes
      // (they should be sent to /login, which requires a resolved state).
      dispatch({ type: SET_ANONYMOUS });
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
