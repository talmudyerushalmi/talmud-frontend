import { RawDraftContentState } from 'draft-js';
import { iMishna, iParallelLink } from '../types/types';
import axiosInstance from './api';

export default class LineService {
  // Convert frontend format to backend InternalParallelLink format
  private static convertParallelsToBackend(parallels: iParallelLink[]): iParallelLink[] {
    console.log('🔍 Converting parallels to backend format:', parallels);
    
    return parallels.map(parallel => {
      const result: iParallelLink = {
        linkText: parallel.linkText,
        tractate: parallel.tractate,
        chapter: parallel.chapter,
        mishna: parallel.mishna,
        lineNumber: parallel.lineNumber,
      };

      // Convert frontend arrays to backend sublinePairs format
      if (parallel.selectedSublineIndices && parallel.currentSublineIndices) {
        const currentIndices = parallel.currentSublineIndices;
        const targetIndices = parallel.selectedSublineIndices;
        
        console.log('🔍 Processing parallel for backend:', {
          parallel,
          currentIndices,
          targetIndices
        });
        
        if (currentIndices.length > 0 && targetIndices.length > 0) {
          // Add sublinePairs to the backend format (not part of interface)
          (result as any).sublinePairs = currentIndices.map((sourceIndex, i) => ({
            sourceIndex,
            targetIndex: targetIndices[i]
          }));
          
          console.log('🔍 Generated sublinePairs:', (result as any).sublinePairs);
        }
      }

      console.log('✅ Converted result:', result);
      return result;
    });
  }

  static async saveLine(tractate: string, chapter: string, mishna: string, line: string, values: any) {
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}/${line}`;
    const s = await axiosInstance.post(url, values);
    return s.data;
  }

  // Save only parallel links for a specific line
  static async saveParallels(tractate: string, chapter: string, mishna: string, line: string, parallels: iParallelLink[]) {
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}/${line}/parallels`;
    const data = {
      parallels: this.convertParallelsToBackend(parallels)
    };
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
