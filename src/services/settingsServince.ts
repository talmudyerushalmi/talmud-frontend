import { iSource } from '../types/types';
import axiosInstance from './api';

export default class SettingsService {
  static readonly BASE = '/settings';

  static async getSettings(settingsID) {
    const url = `${SettingsService.BASE}/${settingsID}`;
    const response = await axiosInstance.get(url);
    return response.data;
  }

  static async addSource(source: iSource) {
    const url = `${SettingsService.BASE}/compositions/add`;
    const data = { ...source };
    await axiosInstance.post(url, data);
    await new Promise((res) => setTimeout(res, 1000));

   // return response.data;
  }
}
