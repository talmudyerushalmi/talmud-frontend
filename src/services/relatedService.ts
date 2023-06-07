import { iManuscript } from '../types/types';
import axiosInstance from './api';

export interface iRelated {
  manuscripts: iManuscript[];
}
export default class RelatedService {
  static async getRelated(tractate, chapter): Promise<iRelated> {
    const url = `/related/${tractate}/${chapter}`;
    const response = await axiosInstance.get(url);
    return response.data;
  }
}
