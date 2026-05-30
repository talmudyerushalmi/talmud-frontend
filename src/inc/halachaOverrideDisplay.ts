import { hebrewMap } from './utils';

/**
 * Render a Hebrew label for a unified group of source halacha ids (2 or 3).
 *
 *   formatUnifiedName(['006','007'])         -> '\u05d5-\u05d6'
 *   formatUnifiedName(['006','007','008'])   -> '\u05d5-\u05d6-\u05d7'
 *
 * Falls back to the raw id when a member isn't in `hebrewMap`, so the UI is never blank.
 */
export function formatUnifiedName(sourceIds: string[]): string {
  return sourceIds.map((id) => hebrewMap.get(id) ?? id).join('-');
}

/**
 * Render a Hebrew label for one part of a split halacha.
 *
 *   formatSplitPartName('003', 1) -> '\u05d21'
 *   formatSplitPartName('003', 2) -> '\u05d22'
 *
 * `partIdx` is 1-based to match the FE's convention (`_split.currentPart`).
 */
export function formatSplitPartName(sourceId: string, partIdx: number): string {
  const base = hebrewMap.get(sourceId) ?? sourceId;
  return `${base}${partIdx}`;
}
