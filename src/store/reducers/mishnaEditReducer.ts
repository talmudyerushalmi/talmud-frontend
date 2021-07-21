import {
  SAVE_EXCERPT,
} from "../actions/mishnaEditActions";

interface EditMishnaState {
  loading: boolean;

}

const initialState: EditMishnaState = {
  loading: false,
};

const mishnaEditReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_EXCERPT:
      console.log('save excerpt', action)
      return {
        ...state,
      };
    
    default:
      return state;
  }
};
export default mishnaEditReducer;
