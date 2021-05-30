import axiosInstance from './api';

export default class ExcerptService {
  static readonly BASE = "/edit/excerpt"



  static async saveExcerpt(tractate: string, chapter: string, mishna: string, values: any ){
    const url = `${ExcerptService.BASE}/${tractate}/${chapter}/${mishna}`;
    const data = {...values}
    const response =  await axiosInstance.post(url, data);
    return response.data;
  }

  static async deleteExcerpt(tractate: string, chapter: string, mishna: string, key: number ){
    const url = `${ExcerptService.BASE}/${tractate}/${chapter}/${mishna}/${key}`;
    const response =  await axiosInstance.delete(url);
    return response.data;
  }


}
