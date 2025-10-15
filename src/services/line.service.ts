import { RawDraftContentState } from 'draft-js';
import { iMishna, iParallelLink } from '../types/types';
import axiosInstance from './api';

export default class LineService {
  // Convert frontend format to backend InternalParallelLink format
  private static convertParallelsToBackend(parallels: iParallelLink[]): iParallelLink[] {
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
        
        if (currentIndices.length > 0 && targetIndices.length > 0) {
          // Add sublinePairs to the backend format (not part of interface)
          (result as any).sublinePairs = currentIndices.map((sourceIndex, i) => ({
            sourceIndex,
            targetIndex: targetIndices[i]
          }));
        }
      }

      return result;
    });
  }

  static async saveLine(tractate: string, chapter: string, mishna: string, line: string, values: any) {
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}/${line}`;
    const s = await axiosInstance.post(url, values);
    return s.data;
  }

  // NEW GRANULAR PARALLEL OPERATIONS

  /**
   * Add a single parallel relationship
   */
  static async addParallel(tractate: string, chapter: string, mishna: string, line: string, parallel: iParallelLink) {
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}/${line}/parallel/add`;
    const backendParallel = this.convertParallelsToBackend([parallel])[0];
    const s = await axiosInstance.post(url, backendParallel);
    return s.data;
  }

  /**
   * Delete a single parallel relationship
   */
  static async deleteParallel(tractate: string, chapter: string, mishna: string, line: string, parallel: iParallelLink) {
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}/${line}/parallel`;
    const backendParallel = this.convertParallelsToBackend([parallel])[0];
    const s = await axiosInstance.delete(url, { data: backendParallel });
    return s.data;
  }

  /**
   * Update a single parallel relationship
   */
  static async updateParallel(tractate: string, chapter: string, mishna: string, line: string, oldParallel: iParallelLink, newParallel: iParallelLink) {
    const url = `/edit/mishna/${tractate}/${chapter}/${mishna}/${line}/parallel`;
    const data = {
      oldParallel: this.convertParallelsToBackend([oldParallel])[0],
      newParallel: this.convertParallelsToBackend([newParallel])[0]
    };
    const s = await axiosInstance.put(url, data);
    return s.data;
  }

  // OLD METHOD REMOVED - Use granular operations instead:
  // LineService.addParallel(), LineService.deleteParallel(), LineService.updateParallel()

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
