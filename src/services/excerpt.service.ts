import axiosInstance from './api';

export default class ExcerptService {
  static readonly BASE = "/edit/excerpt"



  static async saveExcerpt(tractate: string, chapter: string, mishna: string, values: any ){
    const url = `${ExcerptService.BASE}/${tractate}/${chapter}/${mishna}`;
    const data = {...values}
    const s =  await axiosInstance.post(url, data);
    return s.data;
  }

  static async deleteExcerpt(tractate: string, chapter: string, mishna: string, key: number ){
    const url = `${ExcerptService.BASE}/${tractate}/${chapter}/${mishna}/${key}`;
    const s =  await axiosInstance.delete(url);
    return s.data;
  }


}
