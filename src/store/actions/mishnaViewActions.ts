import { action } from "typesafe-actions"

export const SELECT_SUBLINE = "SELECT_SUBLINE"
export const FILTER_EXCERPTS_BY_LINE = "FILTER_EXCERPTS_BY_LINE"
export const REQUEST_START = "REQUEST_START"
export const SELECT_EXCERPT = "SELECT_EXCERPT"
export const SET_EXCERPT_POPUP = "SET_EXCERPT_POPUP"
export const TOGGLE_SHOW_PUNCTUATION = "TOGGLE_SHOW_PUNCTUATION"
export const TOGGLE_DIVIDE_TO_LINES = "TOGGLE_DIVIDE_TO_LINES"
export const TOGGLE_SHOW_SOURCES = "TOGGLE_SHOW_SOURCES"


export const selectSubline = (selectedSublineData, selectedLineIndex) => (dispatch, getState)=> {
dispatch({
    type: SELECT_SUBLINE,
    selectedSublineData,
    selectedLineIndex
  })
  dispatch({
    type: FILTER_EXCERPTS_BY_LINE,
    selectedSublineData
  })

} 

export const selectExcerpt = (excerpt) =>  async (dispatch) => {
    await dispatch({
        type: SELECT_EXCERPT,
        excerpt
    });
  
}

export const toggleShowPunctuation = () => action(TOGGLE_SHOW_PUNCTUATION,{})
export const toggleDivideToLines = () => action(TOGGLE_DIVIDE_TO_LINES,{})
export const toggleShowSources = () => action(TOGGLE_SHOW_SOURCES,{});
export const startRequest = () => action(REQUEST_START,{})
  