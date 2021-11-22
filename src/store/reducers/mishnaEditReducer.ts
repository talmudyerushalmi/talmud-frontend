import { iExcerpt, iMishna } from "../../types/types";
import {
  CLOSE_EXCERPT_DIALOG,
  DELETE_EXCERPT_DONE,
  OPEN_EXCERPT_DIALOG,
  REQUEST_MISHNA_FOR_EDIT_DONE,
  SAVE_EXCERPT, SAVE_EXCERPT_START, SAVE_MISHNA_DONE, SAVE_MISHNA_START, SAVE_NOSACH,
} from "../actions/mishnaEditActions";

interface EditMishnaState {
  loading: boolean;
  isSubmitting: boolean;
  mishnaDoc: iMishna | null;
  excerptDialogOpen: boolean;
  editedExcerpt: iExcerpt | null;
  tractateSettings: any

}

const initialState: EditMishnaState = {
  loading: false,
  isSubmitting: false,
  excerptDialogOpen: false,
  mishnaDoc: null,
  editedExcerpt: null,
  tractateSettings:  { 
    synopsisAllowed: [],
    synopsisList: []}
};

const mishnaEditReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_MISHNA_FOR_EDIT_DONE:
      return {
        ...state,
        mishnaDoc: action.payload.mishnaDoc,
        tractateSettings: action.payload.tractateSettings
      }
    case OPEN_EXCERPT_DIALOG:
      return {
        ...state,
        excerptDialogOpen: true,
        editedExcerpt: action.payload.excerpt
      }
    case CLOSE_EXCERPT_DIALOG:
      return {
        ...state,
        excerptDialogOpen: false
      }  
    case SAVE_EXCERPT_START:
      return {
        ...state,
        isSubmitting: true
      }
    case SAVE_EXCERPT:
      return {
        ...state,
        isSubmitting: false,
        excerptDialogOpen: false,
        mishnaDoc: action.mishnaDoc
      };
    case DELETE_EXCERPT_DONE:
      return {
        ...state,
        loading: false,
        mishnaDoc: action.mishnaDoc
      }; 
    case SAVE_NOSACH:
      return {
        ...state
      }  
    case SAVE_MISHNA_START:
      return {...state, isSubmitting: true};
    case SAVE_MISHNA_DONE:
        return {...state, isSubmitting: false};
    
    default:
      return state;
  }
};
export default mishnaEditReducer;
