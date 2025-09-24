import { RawDraftContentState } from 'draft-js';
import { iMishna, iTractate, iInternalLink } from '../types/types';
import axiosInstance from './api';

export interface RichTextsMishnas {
  mishna: string;
  richTextMishna: RawDraftContentState;
}

interface getChapterReponse {
  totalMishnaiot: number;
  mishnaDocument: iMishna;
  richTextsMishnas?: RichTextsMishnas[];
}

export default class PageService {
  // Convert backend InternalParallelLink format to frontend format  
  private static convertParallelLinksToFrontend(parallelLinks: any[]): iInternalLink[] {
    return parallelLinks
      .filter(parallel => parallel && parallel.tractate) // Safety check
      .map(parallel => ({
        linkText: parallel.linkText || '',
        tractate: parallel.tractate || '',
        chapter: parallel.chapter || '',
        mishna: parallel.mishna || '',
        lineNumber: parallel.lineNumber || '',
        selectedSublineIndices: parallel.sublinePairs?.map((pair: any) => pair.targetIndex) || [],
        currentSublineIndices: parallel.sublinePairs?.map((pair: any) => pair.sourceIndex) || [],
      }));
  }

  private static convertMishnaParallels(mishnaData: any): iMishna {
    if (mishnaData && mishnaData.lines) {
      mishnaData.lines = mishnaData.lines.map(line => {
        if (line.parallels && Array.isArray(line.parallels) && line.parallels.length > 0) {
          try {
            line.parallels = this.convertParallelLinksToFrontend(line.parallels);
          } catch (error) {
            console.error('Error converting parallels for line:', line.lineNumber, error);
            line.parallels = []; // Fallback to empty array
          }
        } else {
          // Ensure parallels is always an array
          line.parallels = line.parallels || [];
        }
        return line;
      });
    }
    return mishnaData;
  }
  static async getPage(tractate, chapter, mishna) {
    const url = `/mishna/${tractate}/${chapter}/${mishna}`;
    const s = await axiosInstance.get(url);
    return s;
  }
  static async getTractate(tractate) {
    const url = `/mishna/${tractate}`;
    const response = await axiosInstance.get(url);
    return response.data;
  }

  static async getMishna(tractate: string, chapter: string, mishna: string): Promise<iMishna> {
    const url = `/mishna/${tractate}/${chapter}/${mishna}`;
    const response = await axiosInstance.get(url);
    return this.convertMishnaParallels(response.data);
  }

  static async getChapter(tractate: string, chapter: string, mishna = 1): Promise<getChapterReponse> {
    const url = `/mishna/${tractate}/${chapter}?mishna=${mishna}`;
    const response = await axiosInstance.get(url);
    return response.data;
  }

  static async getMishnaEdit(tractate, chapter, mishna) {
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}`;
    let response;
    try {
      response = await axiosInstance.get(url);
    } catch (e) {
      alert(e);
    }
    return response.data;
  }

  static async getAllTractates(): Promise<iTractate[]> {
    const url = `/tractates`;
    const response = await axiosInstance.get(url);
    return response.data.tractates;
  }

}
