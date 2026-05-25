import { hebrewMap } from './utils';

/**
 * Render a Hebrew label for a unified pair of source halacha ids.
 *
 *   formatUnifiedName('006', '007') -> '\u05d5-\u05d6'
 *
 * Falls back to the raw ids (joined with '-') when either side isn't in `hebrewMap`,
 * so the UI is never blank.
 */
export function formatUnifiedName(firstId: string, secondId: string): string {
  const a = hebrewMap.get(firstId) ?? firstId;
  const b = hebrewMap.get(secondId) ?? secondId;
  return `${a}-${b}`;
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
