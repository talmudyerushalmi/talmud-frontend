import { START_LOADING, STOP_LOADING } from "../actions/generalActions";



interface GeneralState {
  loading: boolean;
}
const initialState: GeneralState = {
  loading: false,
};

const generalReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        loading: true
      };
    case STOP_LOADING:
      return {
        ...state,
        loading: false
      }  
    default:
      return state;
  }
};
export default generalReducer;
