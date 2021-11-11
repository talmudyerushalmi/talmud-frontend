import axiosInstance from './api';


export default class LineService {
  static async saveLine(tractate: string, chapter :string, mishna :string, line :string, values:any ){
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}/${line}`;
    const data = {...values}
    const s =  await axiosInstance.post(url, data);
    return s.data;
  }
  static async saveNosach(tractate: string, chapter :string, mishna :string, line :string,
    sublineIndex: number,
     lines:string[] ){
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}/${line}/nosach`;
    const data = {sublineIndex,lines}
    const s =  await axiosInstance.post(url, data);
    return s.data;
  }

 
}
