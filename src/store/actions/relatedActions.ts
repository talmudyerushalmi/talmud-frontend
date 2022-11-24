import { iManuscriptPopup } from '../../types/types';
import { action } from 'typesafe-actions';
import RelatedService, { iRelated } from '../../services/relatedService';

export const SET_RELEVANT_MANUSCRIPT = 'SET_RELEVANT_MANUSCRIPT';
export const SET_MANUSCRIPTS_FOR_CHAPTER = 'SET_MANUSCRIPTS_FOR_CHAPTER';

export const setRelevantManuscript = (data: iManuscriptPopup | null) => action(SET_RELEVANT_MANUSCRIPT, data);

export const setManuscriptsForChapter = (tractate: string, chapter: string) => {
  return async (dispatch) => {
    const data = await RelatedService.getRelated(tractate, chapter);
    return dispatch(action(SET_MANUSCRIPTS_FOR_CHAPTER, data.manuscripts));
  };
};
