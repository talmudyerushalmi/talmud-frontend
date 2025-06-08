import axiosInstance from './api';

export class SearchService {
  static async searchText(query: string) {
    const url = `mishna/search?query=${query}`;
    const response = await axiosInstance.get(url);
    return response.data;
  }
}
