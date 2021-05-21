import axios from 'axios';

export default class ExcerptService {
  static async saveExcerpt(tractate, chapter, mishna, values ){
    const url = `${process.env.DB_HOST}/edit/excerpt/${tractate}/${chapter}/${mishna}`;
    const data = {...values}
    const s =  await axios.post(url, data);
    return s.data;
  }

  static async deleteExcerpt(tractate, chapter, mishna, key ){
    const url = `${process.env.DB_HOST}/edit/excerpt/${tractate}/${chapter}/${mishna}/${key}`;
    const s =  await axios.delete(url);
    return s.data;
  }


}
