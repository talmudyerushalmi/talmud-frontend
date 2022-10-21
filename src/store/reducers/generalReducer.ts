import { START_LOADING } from "../actions/generalActions";



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
    default:
      return state;
  }
};
export default generalReducer;
