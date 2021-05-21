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
  SET_CURRENT_TRACTATE,
  SET_SELECTED_FOR_ROUTE,
} from "../actions/navigationActions"

const navigationReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_SELECTED_FOR_ROUTE:
      return {
        ...state,
        selectedTractate: action.selectedTractate,
        selectedChapter: action.selectedChapter,
        selectedMishna: action.selectedMishna,
        selectedLine: action.selectedLine
      }
    case SELECT_TRACTATE:
      return { ...state, selectedTractate: action.selectedTractate }
    case SELECT_CHAPTER:
      return { ...state, selectedChapter: action.selectedChapter }
    case SELECT_MISHNA:
      return { ...state, selectedMishna: action.selectedMishna,
        selectedLine: action.selectedLine
       }
    case SELECT_LINE:
      return { ...state, selectedLine: action.selectedLine }
    case SET_CURRENT_MISHNA:
      return { ...state, currentMishna: action.currentMishna}  

    case RECEIVE_COMPOSITIONS:
      console.log('got ',action)
      return { ...state, compositions: action.compositions, loading: false }
    case REQUEST_COMPOSITIONS:
      return { ...state, loading: true }
    case RECEIVE_TRACTATES:
      return { ...state, tractates: action.tractates, loading: false }
    case RECEIVE_MISHNA:
      console.log("need to update selected mishna", action.currentMishna.id)
      console.log("need to update selected mishna", action.currentMishna.mishna)
      return {
        ...state,
        selectedMishnaData: action.currentMishna,
        mishnaInput: action.currentMishna.mishna,
        loading: false,
      }
    case SET_CURRENT_TRACTATE:
      const tractate = action.tractate
      const findTractate = state.tractates.find(t => t.id === tractate)
      return { ...state, currentTractate: findTractate }
    case RECEIVED_CURRENT_LOCATION:
      return {
        ...state,
        currentTractate: action.currentTractate,
        currentChapter: action.currentChapter,
        currentMishna: action.currentMishna,
        currentLine: action.currentLine,
      }
    case RECEIVED_CURRENT_SELECTION:
      return {
        ...state,
        selectedTractateData: action.selectedTractateData,
        selectedChapterData: action.selectedChapterData,
        selectedMishnaData: action.selectedMishnaData,
        selectedLineData: action.selectedLineData,
      }
    default:
      return state
  }
}
export default navigationReducer
