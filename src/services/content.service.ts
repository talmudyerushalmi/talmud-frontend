import { RawDraftContentState } from 'draft-js';
import { iMishna } from '../types/types';
import axiosInstance from './api';
import { Content } from '../content/types';

export default class ContentService {

  static async GetContent(id: string): Promise<Content | null> {

    const url = `https://cdn.contentful.com/spaces/${process.env.REACT_APP_CONTENTFUL_SPACE}/environments/master/entries/${id}?access_token=${process.env.REACT_APP_CONTENTFUL_TOKEN}`;
    try {
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (e) {
      alert('error ' + JSON.stringify(e));
      return null;
    }
  }


}
