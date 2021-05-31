import {
    GET_USER_AUTH,
    SET_USER_AUTH,
  } from "../actions/authActions"
  
  const authReducer = (state = {}, action: any) => {
    switch (action.type) {
      case GET_USER_AUTH:
        return state;
      case SET_USER_AUTH:
        return { ...state, userAuth: action.userAuth }
      default:
        return state
    }
  }
  export default authReducer
  