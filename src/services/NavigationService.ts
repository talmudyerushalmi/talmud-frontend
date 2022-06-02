import { iMishnaForNavigation } from '../components/shared/ChooseMishnaBar';
import axiosInstance from './api';


export default class NavigationService {
  static async getMishnaForNavigation(tractate, chapter, mishna): Promise<iMishnaForNavigation> {
    const url = `/navigation/${tractate}/${chapter}/${mishna}`;
    const response = await axiosInstance.get(url);
    return response.data;
  }
}
