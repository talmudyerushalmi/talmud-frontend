import {
    GET_USER_AUTH,
  SET_SIGN_OUT,
    SET_USER_AUTH,
  } from "../actions/authActions"
  


  const authReducer = (state = {}, action: any) => {
    switch (action.type) {
      case GET_USER_AUTH:
        return state;
      case SET_USER_AUTH:
        console.log(action.userAuth)
        const username = action.userAuth.idToken.payload.email;
        return { ...state, userAuth: action.userAuth, username }
      case SET_SIGN_OUT:
        return { ...state, userAuth: null, username: null}  
      default:
        return state
    }
  }
  export default authReducer
  