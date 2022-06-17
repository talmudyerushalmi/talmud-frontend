import { action } from "typesafe-actions";
import { ShowEditType } from "../reducers/mishnaViewReducer";

export const SELECT_SUBLINES = "SELECT_SUBLINES";
export const FILTER_EXCERPTS_BY_LINES = "FILTER_EXCERPTS_BY_LINES";
export const REQUEST_START = "REQUEST_START";
export const SELECT_EXCERPT = "SELECT_EXCERPT";
export const SET_EXCERPT_POPUP = "SET_EXCERPT_POPUP";
export const TOGGLE_SHOW_PUNCTUATION = "TOGGLE_SHOW_PUNCTUATION";
export const TOGGLE_DIVIDE_TO_LINES = "TOGGLE_DIVIDE_TO_LINES";
export const TOGGLE_SHOW_SOURCES = "TOGGLE_SHOW_SOURCES";
export const TOGGLE_EDIT_TYPE = "TOGGLE_EDIT_TYPE";
export const SET_MISHNA_VIEW_OPTIONS = "SET_MISHNA_VIEW_OPTIONS";

export const selectSublines =
  (
    selectedSublines,
  ) =>
  (dispatch, getState) => {
    console.log(selectedSublines);
    dispatch({
      type: SELECT_SUBLINES,
      selectedSublines,
    });
    dispatch({
      type: FILTER_EXCERPTS_BY_LINES,
      selectedSublines,
    });
  };

export const selectExcerpt = (excerpt) => async (dispatch) => {
  await dispatch({
    type: SELECT_EXCERPT,
    excerpt,
  });
};

export const toggleShowPunctuation = () => action(TOGGLE_SHOW_PUNCTUATION, {});
export const toggleDivideToLines = () => action(TOGGLE_DIVIDE_TO_LINES, {});
export const toggleShowSources = () => action(TOGGLE_SHOW_SOURCES, {});
export const toggleEditType = (showEditType: ShowEditType) => action(TOGGLE_EDIT_TYPE, {showEditType});
export const startRequest = () => action(REQUEST_START, {});
export const setMishnaViewOptions = (options:any) => {
  return ({
    type: SET_MISHNA_VIEW_OPTIONS,
    options
  })
}
