import {
  FILTER_EXCERPTS_BY_LINE,
  REQUEST_START,
  SELECT_EXCERPT,
  SELECT_SUBLINE,
  SET_EXCERPT_POPUP,
  TOGGLE_DIVIDE_TO_LINES,
  TOGGLE_SHOW_SOURCES,
  TOGGLE_SHOW_PUNCTUATION,
} from "../actions/mishnaViewActions"
import {
  RECEIVE_MISHNA,
  SET_CURRENT_MISHNA,
} from "../actions/navigationActions"

const mishnaViewReducer = (state = {}, action) => {
  console.log("reducer view", action)
  switch (action.type) {
    case SET_CURRENT_MISHNA:
      const excerpts = action.currentMishna?.excerpts?.sort(
        (a, b) => a.selection.fromLine - b.selection.fromLine
      )
      return {
        ...state,
        excerpts,
        filteredExcerpts: action.currentMishna?.excerpts,
      }
    case REQUEST_START:
      return { ...state, loading: true }
    case RECEIVE_MISHNA:
      return { ...state, currentMishna: action.currentMishna, loading: false }
    case SELECT_SUBLINE:
      return {
        ...state,
        selectedSublineData: action.selectedSublineData,
        selectedLineIndex: action.selectedLineIndex,
      }
    case SELECT_EXCERPT:
        return {...state, selectedExcerpt: action.excerpt,
          detailsExcerptPopup: action.excerpt!==null }  
    case SET_EXCERPT_POPUP: 
    return {...state, detailsExcerptPopup: action.detailsExcerptPopup}  
    case TOGGLE_SHOW_PUNCTUATION:
      return {...state, showPunctuation: !state.showPunctuation}
    case TOGGLE_DIVIDE_TO_LINES:
      const newDivideToLines = !state.divideToLines;
      return {...state, divideToLines: newDivideToLines,
        showPunctuation: newDivideToLines ? state.showPunctuation : false
       }
    case TOGGLE_SHOW_SOURCES:
      return {...state, showSources: !state.showSources}  
    case FILTER_EXCERPTS_BY_LINE:
      const sublineIndex = action?.selectedSublineData?.index
      const newExcerpts = action.selectedSublineData
        ? state.excerpts.filter(e => {
            return (
              sublineIndex >= e.selection.fromSubline &&
              sublineIndex <= e.selection.toSubline
            )
          })
        : state.excerpts

      return {
        ...state,
        filteredExcerpts: newExcerpts,
        expanded: (action.selectedSublineData),
      }
    default:
      return state
  }
}
export default mishnaViewReducer
