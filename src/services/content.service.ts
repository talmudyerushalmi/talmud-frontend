import { RawDraftContentState } from 'draft-js';
import { iMishna } from '../types/types';
import axiosInstance from './api';
import { Content } from '../content/types';

export default class ContentService {

  static async GetContent(): Promise<Content | null> {

    const url = `https://cdn.contentful.com/spaces/hpk56ofsdu1h/environments/master/entries/72BKx42zS7UF9hK2yRMisE?access_token=88Cc9MmuDbVSdfjrVejQ5rzxBy3N3R4CF7B5UqSw0GA`;
    try {
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (e) {
      alert('error ' + JSON.stringify(e));
      return null;
    }
  }


}
