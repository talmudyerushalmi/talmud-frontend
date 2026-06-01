import { RawDraftContentState } from 'draft-js';
import { iMishna, iTractate, iParallelLink } from '../types/types';
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
  private static convertParallelLinksToFrontend(parallelLinks: Partial<iParallelLink>[]): iParallelLink[] {
    return parallelLinks
      .filter(parallel => parallel && parallel.tractate) // Safety check
      .map(parallel => ({
        linkText: parallel.linkText || '',
        tractate: parallel.tractate || '',
        chapter: parallel.chapter || '',
        mishna: parallel.mishna || '',
        lineNumber: parallel.lineNumber || '',
        selectedSublineIndices: (parallel as any).sublinePairs?.map((pair: any) => pair.targetIndex) || [],
        currentSublineIndices: (parallel as any).sublinePairs?.map((pair: any) => pair.sourceIndex) || [],
      }));
  }

  private static convertMishnaParallels(mishnaData: iMishna): iMishna {
    if (mishnaData && mishnaData.lines) {
      const convertedLines = mishnaData.lines.map(line => {
        let convertedParallels: iParallelLink[] = [];
        if (line.parallels && Array.isArray(line.parallels) && line.parallels.length > 0) {
          try {
            convertedParallels = this.convertParallelLinksToFrontend(line.parallels);
          } catch (error) {
            console.error('Error converting parallels for line:', line.lineNumber, error);
            convertedParallels = []; // Fallback to empty array
          }
        }
        
        return {
          ...line,
          parallels: convertedParallels
        };
      });
      
      return {
        ...mishnaData,
        lines: convertedLines
      } as iMishna;
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

  static async getMishna(
    tractate: string,
    chapter: string,
    mishna: string,
    opts: { part?: number } = {},
  ): Promise<iMishna> {
    // `?part=N` is only meaningful for halachas that have been split via the override admin.
    // The BE clamps invalid values and ignores it for non-split halachas, so it's safe to
    // always pass through when present.
    const qs = opts.part !== undefined ? `?part=${opts.part}` : '';
    const url = `/mishna/${tractate}/${chapter}/${mishna}${qs}`;
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

  /**
   * `opts.raw=true` requests the un-overlaid tractate list — used by the admin nav bar
   * so editors can pick each underlying source halacha (ב, ג) when unifies are in play.
   * View-side callers omit it and keep today's override-aware merged navigation.
   */
  static async getAllTractates(opts: { raw?: boolean } = {}): Promise<iTractate[]> {
    const url = opts.raw ? `/tractates?raw=true` : `/tractates`;
    const response = await axiosInstance.get(url);
    return response.data.tractates;
  }

  static async getSynopsisList(): Promise<any> {
    const url = `/settings/synopsis/list`;
    const response = await axiosInstance.get(url);
    return response.data;
  }

}
