import { hebrewMap } from './utils';

/**
 * Render a Hebrew label for a unified group of source halacha ids (2 or 3).
 *
 *   formatUnifiedName(['006','007'])         -> 'ו-ז'
 *   formatUnifiedName(['006','007','008'])   -> 'ו-ז-ח'
 *
 * Falls back to the raw id when a member isn't in `hebrewMap`, so the UI is never blank.
 */
export function formatUnifiedName(sourceIds: string[]): string {
  return sourceIds.map((id) => hebrewMap.get(id) ?? id).join('-');
}

/**
 * Render a Hebrew label for one part of a split halacha.
 *
 *   formatSplitPartName('003', 1) -> 'ג1'
 *   formatSplitPartName('003', 2) -> 'ג2'
 *
 * `partIdx` is 1-based to match the FE's convention (`_split.currentPart`).
 */
export function formatSplitPartName(sourceId: string, partIdx: number): string {
  const base = hebrewMap.get(sourceId) ?? sourceId;
  return `${base}${partIdx}`;
}
