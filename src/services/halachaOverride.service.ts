import { RawDraftContentState } from 'draft-js';
import axiosInstance from './api';

/** Position inside a Mishna's rich text where a split cut is placed. */
export interface MishnaCut {
  blockKey: string;
  offset: number;
}

/** Two adjacent source halachas presented as one (e.g. \u05d5+\u05d6). */
export interface UnifyOperation {
  kind: 'unify';
  sources: [string, string];
}

/** One source halacha presented as 2 or 3 mini-halachas. */
export interface SplitOperation {
  kind: 'split';
  source: string;
  /** Indices in the source's sugia list at which each new part begins. Length 1 or 2. */
  sugiaBoundaries: number[];
  /** Where to cut the Mishna's rich text. `mishnaCuts.length === sugiaBoundaries.length`. */
  mishnaCuts: MishnaCut[];
}

export type HalachaOperation = UnifyOperation | SplitOperation;

export interface HalachaOverride {
  tractate: string;
  chapter: string;
  operations: HalachaOperation[];
  updatedBy?: string;
  updatedAt?: string;
}

/** Per-halacha structural summary used by the admin UI to drive split editing. */
export interface SugiaInfo {
  sugiaName: string;
  firstSublineIndex: number;
  firstLineNumber: string;
  firstLineIndex: number;
  lineCount: number;
}
export interface HalachaStructure {
  source: string;
  sugias: SugiaInfo[];
  richTextMishna: RawDraftContentState | null;
}

export interface GetHalachaOverrideResponse {
  override: HalachaOverride | null;
  chapterStructure: HalachaStructure[];
}

export interface UpsertHalachaOverridePayload {
  operations: HalachaOperation[];
}

/**
 * Client for the editor-only `/edit/halacha-overrides/*` API. Backed by `axiosInstance`
 * (same auth pipeline as the rest of the FE), so a logged-in editor's JWT goes along
 * automatically.
 */
export default class HalachaOverrideService {
  static async get(
    tractate: string,
    chapter: string,
  ): Promise<GetHalachaOverrideResponse> {
    const url = `/edit/halacha-overrides/${tractate}/${chapter}`;
    const response = await axiosInstance.get(url);
    return response.data;
  }

  static async upsert(
    tractate: string,
    chapter: string,
    payload: UpsertHalachaOverridePayload,
  ): Promise<HalachaOverride> {
    const url = `/edit/halacha-overrides/${tractate}/${chapter}`;
    const response = await axiosInstance.put(url, payload);
    return response.data;
  }

  static async remove(
    tractate: string,
    chapter: string,
  ): Promise<{ deleted: boolean }> {
    const url = `/edit/halacha-overrides/${tractate}/${chapter}`;
    const response = await axiosInstance.delete(url);
    return response.data;
  }
}
