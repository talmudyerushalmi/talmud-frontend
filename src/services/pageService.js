import axios from 'axios';

export default class PageService {
  static host = process.env.REACT_APP_DB_HOST;

  static async getPage(tractate, chapter, mishna ){
    const url = `${PageService.host}/mishna/${tractate}/${chapter}/${mishna}`;
    const s =  await axios.get(url);
    return s;
  }
  static async getTractate(tractate) {
    const url = `${PageService.host}/mishna/${tractate}`;
    const response =  await axios.get(url);
    return response.data;
  }

  static async getMishna(tractate, chapter, mishna ){
    const url = `${PageService.host}/mishna/${tractate}/${chapter}/${mishna}`;
    const response =  await axios.get(url);
    return response.data;
  }

  static async getMishnaEdit(tractate, chapter, mishna ){
    const url = `${PageService.host}/edit/mishna/${tractate}/${chapter}/${mishna}`;
    const s =  await axios.get(url);
    return s;
  }

  static async getAllTractates(){
    const url = `${PageService.host}/tractates`;
    const response =  await axios.get(url);
    return response.data;
  }

  static async getSettings(settingsID){
    const url = `${PageService.host}/settings/${settingsID}`;
    const response =  await axios.get(url);
    return response.data;
  }

}
