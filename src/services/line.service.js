import axios from 'axios';

export default class LineService {
  static async saveLine(tractate, chapter, mishna, line, values ){
      console.log('save line', values)
    const url = `${process.env.DB_HOST}/edit/mishna/${tractate}/${chapter}/${mishna}/${line}`;
    const data = {...values}
    const s =  await axios.post(url, data);
    return s.data;
  }

 
}
