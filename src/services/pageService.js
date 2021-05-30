import axiosInstance from './api';


export default class PageService {

  static async getPage(tractate, chapter, mishna ){
    const url = `/mishna/${tractate}/${chapter}/${mishna}`;
    const s =  await axiosInstance.get(url);
    return s;
  }
  static async getTractate(tractate) {
    const url = `/mishna/${tractate}`;
    const response =  await axiosInstance.get(url);
    return response.data;
  }

  static async getMishna(tractate, chapter, mishna ){
    const url = `/mishna/${tractate}/${chapter}/${mishna}`;
    const response =  await axiosInstance.get(url);
    return response.data;
  }

  static async getMishnaEdit(tractate, chapter, mishna ){
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}`;
    let response;
    try {
      response =  await axiosInstance.get(url);
    }
    catch(e){
      alert(e);
    }
    return response;
  }

  static async getAllTractates(){
    const url = `/tractates`;
    const response =  await axiosInstance.get(url);
    return response.data;
  }

  static async getSettings(settingsID){
    const url = `/settings/${settingsID}`;
    const response =  await axiosInstance.get(url);
    return response.data;
  }

}
