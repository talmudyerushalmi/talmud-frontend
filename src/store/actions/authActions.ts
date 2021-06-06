import { Auth } from 'aws-amplify';
export const GET_USER_AUTH = "GET_USER_AUTH"
export const SET_USER_AUTH = "SET_USER_AUTH"
export const SET_SIGN_OUT = "SET_SIGN_OUT";

export function signOut(){
  return async function (dispatch: any) {
    await Auth.signOut();
    dispatch(setSignout())
   }
}

export function getUserAuth() {
    return async function (dispatch: any) {
      try{
      const userAuth = await Auth.currentSession();
      dispatch(setUserAuth({...userAuth}))
      }catch(e){
      }
     }
    }
  

export const setUserAuth = (userAuth: any) => ({
  type: SET_USER_AUTH,
  userAuth
})

export const setSignout = ()=>({
  type: SET_SIGN_OUT
})
