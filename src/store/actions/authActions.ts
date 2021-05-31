import { Auth } from 'aws-amplify';

export const GET_USER_AUTH = "GET_USER_AUTH"
export const SET_USER_AUTH = "SET_USER_AUTH"


export function getUserAuth() {
    return async function (dispatch: any) {
      const userAuth = await Auth.currentSession()
      dispatch(setUserAuth({...userAuth}))
     }
    }
  

export const setUserAuth = (userAuth: any) => ({
  type: SET_USER_AUTH,
  userAuth
})

