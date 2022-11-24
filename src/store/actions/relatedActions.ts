import { iManuscriptPopup } from '../../types/types';
import { action } from 'typesafe-actions';

export const SET_RELEVANT_MANUSCRIPT = 'SET_RELEVANT_MANUSCRIPT';

export const setRelevantManuscript = (data: iManuscriptPopup | null) =>
  action(SET_RELEVANT_MANUSCRIPT, data);