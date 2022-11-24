import { iManuscriptPopup } from '../../types/types';
import { action } from 'typesafe-actions';
import RelatedService from '../../services/relatedService';

export const SET_SUBLINE_DATA = 'SET_SUBLINE_DATA';
export const SET_MANUSCRIPTS_FOR_CHAPTER = 'SET_MANUSCRIPTS_FOR_CHAPTER';

export const setSublineData = (data: iManuscriptPopup | null) => action(SET_SUBLINE_DATA, data);

export const setManuscriptsForChapter = (tractate: string, chapter: string) => {
  return async (dispatch) => {
    const data = await RelatedService.getRelated(tractate, chapter);
    return dispatch(action(SET_MANUSCRIPTS_FOR_CHAPTER, data.manuscripts));
  };
};
