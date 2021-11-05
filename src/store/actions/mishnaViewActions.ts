import { action } from "typesafe-actions";

export const SELECT_SUBLINES = "SELECT_SUBLINES";
export const FILTER_EXCERPTS_BY_LINES = "FILTER_EXCERPTS_BY_LINES";
export const REQUEST_START = "REQUEST_START";
export const SELECT_EXCERPT = "SELECT_EXCERPT";
export const SET_EXCERPT_POPUP = "SET_EXCERPT_POPUP";
export const TOGGLE_SHOW_PUNCTUATION = "TOGGLE_SHOW_PUNCTUATION";
export const TOGGLE_DIVIDE_TO_LINES = "TOGGLE_DIVIDE_TO_LINES";
export const TOGGLE_SHOW_SOURCES = "TOGGLE_SHOW_SOURCES";

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
export const startRequest = () => action(REQUEST_START, {});
