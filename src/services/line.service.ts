import { RawDraftContentState } from 'draft-js';
import { iMishna, iInternalLink } from '../types/types';
import axiosInstance from './api';

export default class LineService {
  // Convert frontend format to backend InternalParallelLink format
  private static convertParallelsToBackend(parallels: iInternalLink[]): any[] {
    return parallels.map(parallel => ({
      linkText: parallel.linkText,
      tractate: parallel.tractate,
      chapter: parallel.chapter,
      mishna: parallel.mishna,
      lineNumber: parallel.lineNumber,
      sublineIndex: parallel.sublineIndex,
      sourceSublineIndex: parallel.currentSublineIndex,
    }));
  }

  static async saveLine(tractate: string, chapter: string, mishna: string, line: string, values: any) {
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}/${line}`;
    const data = { ...values };
    
    // Convert parallels from frontend format to backend format
    if (data.parallels && Array.isArray(data.parallels)) {
      data.parallels = this.convertParallelsToBackend(data.parallels);
    }
    const s = await axiosInstance.post(url, data);
    return s.data;
  }
  static async saveNosach(
    tractate: string,
    chapter: string,
    mishna: string,
    line: string,
    sublineIndex: number,
    nosach: RawDraftContentState,
    nosachText: string[]
  ): Promise<iMishna | null> {
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}/${line}/nosach`;
    const data = { sublineIndex, nosach, nosachText };
    try {
      const res = await axiosInstance.post(url, data);
      return res.data;
    } catch (e) {
      alert('error ' + JSON.stringify(e));
      return null;
    }
  }

  static async deleteSubline(tractate: string, chapter: string, mishna: string, line: string, sublineIndex: number) {
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}/${line}/${sublineIndex}`;
    const data = {};
    const s = await axiosInstance.delete(url, data);
    return s.data;
  }
}
