import { action } from 'typesafe-actions';
import PageService from '../../services/pageService';
import { ShowEditType } from '../reducers/mishnaViewReducer';
import { startLoading, stopLoading } from './generalActions';

export const SELECT_SUBLINES = 'SELECT_SUBLINES';
export const FILTER_EXCERPTS_BY_LINES = 'FILTER_EXCERPTS_BY_LINES';
export const REQUEST_START = 'REQUEST_START';
export const SELECT_EXCERPT = 'SELECT_EXCERPT';
export const SET_EXCERPT_POPUP = 'SET_EXCERPT_POPUP';
export const TOGGLE_SHOW_PUNCTUATION = 'TOGGLE_SHOW_PUNCTUATION';
export const TOGGLE_DIVIDE_TO_LINES = 'TOGGLE_DIVIDE_TO_LINES';
export const TOGGLE_SHOW_SOURCES = 'TOGGLE_SHOW_SOURCES';
export const TOGGLE_EDIT_TYPE = 'TOGGLE_EDIT_TYPE';
export const SET_MISHNA_VIEW_OPTIONS = 'SET_MISHNA_VIEW_OPTIONS';
export const CLEAR_MISHNAIOT = 'CLEAR_MISHNAIOT';
export const ADD_MISHNA_TO_MISHNAIOT = 'ADD_MISHNA_TO_MISHNAIOT';

export const selectSublines = (selectedSublines) => (dispatch, getState) => {
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
export const toggleEditType = (showEditType: ShowEditType) => action(TOGGLE_EDIT_TYPE, { showEditType });
export const startRequest = () => action(REQUEST_START, {});
export const setMishnaViewOptions = (options: any) => {
  return {
    type: SET_MISHNA_VIEW_OPTIONS,
    options,
  };
};

export function getRichMishnaiotForChapter(tractate: string, chapter: string, newChapter = false) {
  return async function (dispatch, getState) {
    if (newChapter) {
      dispatch({
        type: CLEAR_MISHNAIOT,
      });
    }
    let state = getState();
    const mishnaiot = state.mishnaView.mishnaiot.length;
    
    // If already loading or already have all mishnas, return
    if (state.general.loading) {
      return;
    }
    
    // If we already have some mishnas and haven't loaded all yet, continue lazy loading
    if (mishnaiot > 0 && mishnaiot < state.mishnaView.totalMishnaiot) {
      dispatch(startLoading());
      const res = await PageService.getChapter(tractate, chapter, mishnaiot + 1);
      dispatch(stopLoading());

      dispatch({
        type: ADD_MISHNA_TO_MISHNAIOT,
        mishna: { ...res.mishnaDocument },
        totalMishnaiot: res.totalMishnaiot,
        richTextsMishnas: res.richTextsMishnas,
      });
      return;
    }
    
    // If starting fresh (newChapter or no mishnas), load ALL mishnas at once
    if (mishnaiot === 0) {
      dispatch(startLoading());
      
      // Get first mishna to know total count
      const firstRes = await PageService.getChapter(tractate, chapter, 1);
      const totalMishnaiot = firstRes.totalMishnaiot;
      
      // Dispatch first mishna
      dispatch({
        type: ADD_MISHNA_TO_MISHNAIOT,
        mishna: { ...firstRes.mishnaDocument },
        totalMishnaiot: firstRes.totalMishnaiot,
        richTextsMishnas: firstRes.richTextsMishnas,
      });
      
      // Load remaining mishnas
      for (let i = 2; i <= totalMishnaiot; i++) {
        const res = await PageService.getChapter(tractate, chapter, i);
        dispatch({
          type: ADD_MISHNA_TO_MISHNAIOT,
          mishna: { ...res.mishnaDocument },
          totalMishnaiot: res.totalMishnaiot,
          richTextsMishnas: res.richTextsMishnas,
        });
      }
      
      dispatch(stopLoading());
    }
  };
}
