import axiosInstance from './api';
import { Content } from '../content/types';

export default class ContentService {

  static async GetAllContent(locale: string): Promise<Content | null> {
    const url = `https://cdn.contentful.com/spaces/${process.env.REACT_APP_CONTENTFUL_SPACE}/entries?access_token=${process.env.REACT_APP_CONTENTFUL_TOKEN}&include=1&locale=${locale}`
    try {
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (e) {
      alert('error ' + JSON.stringify(e));
      return null;
    }
  }

  static async GetContent(id: string, locale='he-IL'): Promise<Content | null> {
    if (!id) return null
    const url = `https://cdn.contentful.com/spaces/${process.env.REACT_APP_CONTENTFUL_SPACE}/environments/master/entries/${id}?access_token=${process.env.REACT_APP_CONTENTFUL_TOKEN}&locale=${locale}`;
    try {
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (e) {
      console.error('error ' + JSON.stringify(e), url);
      return null;
    }
  }


}
