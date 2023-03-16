import { iMishna } from '../types/types';
import axiosInstance from './api';

export default class MishnaActionsService {
  static readonly BASE = '/actions/mishna';

  static async syncParallels(tractate: string, chapter: string, mishna: string, lineNumber: string): Promise<iMishna>{
    const url = `${MishnaActionsService.BASE}/sync_parallels/${tractate}/${chapter}/${mishna}/${lineNumber}`;
    const guid = `${tractate}_${chapter}_${mishna}`;
    const data = {};
    const response = await axiosInstance.post(url, data);
    await new Promise((res) => setTimeout(res, 1000));

    return response.data;
  }

}
