import axiosInstance from './api';


export default class LineService {
  static async saveLine(tractate, chapter, mishna, line, values ){
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}/${line}`;
    const data = {...values}
    const s =  await axiosInstance.post(url, data);
    return s.data;
  }

 
}
