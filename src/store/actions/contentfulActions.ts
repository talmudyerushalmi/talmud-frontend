import { action } from 'typesafe-actions';
import ContentService from '../../services/content.service';

export const GET_ALL_CONTENT_FOR_LOCALE = 'GET_ALL_CONTENT_FOR_LOCALE';


export const getAllContentItems = () => {
  return async (dispatch) => {
    const dataHeb = await ContentService.GetAllContent("he-IL");
    const dataEn = await ContentService.GetAllContent("en-US");
    const payload = {
      "he-IL": dataHeb,
      "en-US": dataEn
    }
    return dispatch(action(GET_ALL_CONTENT_FOR_LOCALE, payload));
  };
};
