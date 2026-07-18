import axiosInstance from './api';

/** One named sugya in a chapter — one row in the checkbox list. */
export interface SugyaListing {
  halacha: string;
  /** 0-based index within the halacha's sugya list. Anonymous intro blocks are excluded. */
  sugyaIndex: number;
  sugyaName: string;
  sublineCount: number;
  /** How many sublines in this sugya carry at least one annotation (any type). */
  taggedSublineCount: number;
}

/** Selection sent back to the export endpoint. */
export interface SugyaRef {
  halacha: string;
  sugyaIndex: number;
}

export interface ExportSugyotPayload {
  tractate: string;
  chapter: string;
  sugyot: SugyaRef[];
  /** When false, the resulting JSONL omits the `annotations` field entirely. */
  includeTags: boolean;
}

/**
 * Client for the editor-only `/edit/ai-tagging/*` API.
 *
 * The export endpoint returns a ZIP archive (Content-Type `application/zip`)
 * containing one `.jsonl` file per selected sugya — we ask for a Blob so
 * browsers hand us a downloadable file directly.
 */
export default class AiTaggingService {
  static async listChapter(
    tractate: string,
    chapter: string,
  ): Promise<SugyaListing[]> {
    const url = `/edit/ai-tagging/chapter/${tractate}/${chapter}`;
    const response = await axiosInstance.get<SugyaListing[]>(url);
    return response.data;
  }

  /**
   * POSTs the selection and returns the raw ZIP body plus a filename hint
   * extracted from the server's `Content-Disposition`. The caller wires this
   * up to a `<a download>` click to trigger the browser download.
   */
  static async exportSugyot(
    payload: ExportSugyotPayload,
  ): Promise<{ blob: Blob; filename: string }> {
    const url = `/edit/ai-tagging/export`;
    const response = await axiosInstance.post(url, payload, {
      responseType: 'blob',
    });
    const disposition = (response.headers?.['content-disposition'] ?? '') as string;
    const filename = parseDispositionFilename(disposition)
      ?? `ai-tagging_${payload.tractate}_${payload.chapter}.zip`;
    return { blob: response.data as Blob, filename };
  }
}

/**
 * Parses `filename="..."` (unquoted variants accepted too) out of a
 * `Content-Disposition` header. Returns `undefined` when nothing matches so
 * callers can substitute a sensible default.
 */
function parseDispositionFilename(disposition: string): string | undefined {
  const m = /filename\*?=(?:UTF-8'')?"?([^"';]+)"?/i.exec(disposition);
  return m?.[1];
}
