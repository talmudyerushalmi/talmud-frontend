import axiosInstance from './api';

export default class MishnaService {
  static readonly BASE = "/edit/mishna"



  static async saveMishna(tractate: string, chapter: string, mishna: string, values: any ){
    const url = `${MishnaService.BASE}/${tractate}/${chapter}/${mishna}`;
    const id = `${tractate}_${chapter}_${mishna}`
    const data = {id,...values}
    const response =  await axiosInstance.post(url, data);
    await new Promise((res) => setTimeout(res, 1000));

    return response.data;
  }



}
