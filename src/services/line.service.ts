import { RawDraftContentState } from 'draft-js';
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
    nosach: RawDraftContentState,
    nosachText: string[]
    ){
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}/${line}/nosach`;
    const data = {sublineIndex, nosach, nosachText}
    const s =  await axiosInstance.post(url, data);
    return s.data;
  }

  static async deleteSubline(tractate: string, chapter :string, mishna :string, line :string,
    sublineIndex: number){
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}/${line}/${sublineIndex}`;
    const data = {}
    const s =  await axiosInstance.delete(url, data);
    return s.data;
  }

 
}
