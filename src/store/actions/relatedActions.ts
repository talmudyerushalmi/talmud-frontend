import { iManuscriptPopup } from '../../types/types';
import { action } from 'typesafe-actions';
import RelatedService from '../../services/relatedService';

export const SET_SUBLINE_DATA = 'SET_SUBLINE_DATA';
export const SET_MANUSCRIPTS_FOR_CHAPTER = 'SET_MANUSCRIPTS_FOR_CHAPTER';

export const setSublineData = (data: iManuscriptPopup | null) => action(SET_SUBLINE_DATA, data);

export const setManuscriptsForChapter = (tractate: string, chapter: string) => {
  return async (dispatch, getState) => {
    const {
      navigation: { currentRoute },
      related: { manuscriptsForChapter },
    } = getState();
    // if the current route is the same as the tractate and chapter, don't fetch the data
    if (currentRoute?.tractate === tractate && currentRoute?.chapter === chapter && manuscriptsForChapter.length > 0) {
      return;
    }
    const data = await RelatedService.getRelated(tractate, chapter);
    return dispatch(action(SET_MANUSCRIPTS_FOR_CHAPTER, data.manuscripts));
  };
};
