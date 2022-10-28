import { routeObject } from '../../routes/AdminRoutes';
import { iChapter, iLine, iMishna, iTractate } from '../../types/types';
import {
  RECEIVED_CURRENT_LOCATION,
  RECEIVED_CURRENT_SELECTION,
  RECEIVE_COMPOSITIONS,
  RECEIVE_MISHNA,
  RECEIVE_TRACTATES,
  REQUEST_COMPOSITIONS,
  SELECT_CHAPTER,
  SELECT_LINE,
  SELECT_MISHNA,
  SELECT_TRACTATE,
  SET_CURRENT_MISHNA,
  SET_CURRENT_ROUTE,
  SET_CURRENT_TRACTATE,
  SET_ROUTE,
  SET_SELECTED_FOR_ROUTE
} from '../actions/navigationActions';

interface NavigationState {
  compositions: any;
  tractates: iTractate[];
  tractateSettings: any;
  selectedTractate: iTractate | null;
  selectedChapter: iChapter | null;
  selectedMishna: iMishna | null;
  selectedLine: iLine | null;
  currentTractate: iTractate | null;
  currentChapter: iChapter | null;
  currentMishna: iMishna | null;
  currentLine: iLine | null;
  currentRoute: routeObject | null;
}
const initialState: NavigationState = {
  compositions: [],
  tractates: [],
  tractateSettings: {},
  selectedTractate: null,
  selectedChapter: null,
  selectedMishna: null,
  selectedLine: null,
  currentTractate: null,
  currentChapter: null,
  currentMishna: null,
  currentLine: null,
  currentRoute: null
};

const navigationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROUTE:
      const newRoute: routeObject = {
        tractate: action.tractate,
        chapter: action.chapter,
        mishna: action.mishna,
        line: action.line
      };
      return {
        ...state,
        currentRoute: newRoute
      };
    case SET_SELECTED_FOR_ROUTE:
      return {
        ...state,
        selectedTractate: action.selectedTractate,
        selectedChapter: action.selectedChapter,
        selectedMishna: action.selectedMishna,
        selectedLine: action.selectedLine
      };
    case SELECT_TRACTATE:
      return { ...state, selectedTractate: action.selectedTractate };
    case SELECT_CHAPTER:
      return { ...state, selectedChapter: action.selectedChapter };
    case SELECT_MISHNA:
      return {
        ...state,
        selectedMishna: action.selectedMishna,
        selectedLine: action.selectedLine
      };
    case SELECT_LINE:
      return { ...state, selectedLine: action.selectedLine };
    case SET_CURRENT_MISHNA:
      return { ...state, currentMishna: action.currentMishna };
    case SET_CURRENT_ROUTE:
      return {
        ...state,
        currentTractate: action.currentTractate,
        currentChapter: action.currentChapter,
        currentMishna: action.currentMishna,
        currentLine: action.currentLine
      };
    case RECEIVE_COMPOSITIONS:
      return { ...state, compositions: action.compositions };
    case REQUEST_COMPOSITIONS:
      return { ...state, loading: true };
    case RECEIVE_TRACTATES:
      return { ...state, tractates: action.tractates };
    case RECEIVE_MISHNA:
      return {
        ...state,
        selectedMishnaData: action.currentMishna,
        mishnaInput: action.currentMishna.mishna
      };
    case SET_CURRENT_TRACTATE:
      const tractate = action.tractate;
      const findTractate = state.tractates.find((t) => t.id === tractate);
      return { ...state, currentTractate: findTractate };
    case RECEIVED_CURRENT_LOCATION:
      return {
        ...state,
        currentTractate: action.currentTractate,
        currentChapter: action.currentChapter,
        currentMishna: action.currentMishna,
        currentLine: action.currentLine
      };
    case RECEIVED_CURRENT_SELECTION:
      return {
        ...state,
        selectedTractateData: action.selectedTractateData,
        selectedChapterData: action.selectedChapterData,
        selectedMishnaData: action.selectedMishnaData,
        selectedLineData: action.selectedLineData
      };
    default:
      return state;
  }
};
export default navigationReducer;
