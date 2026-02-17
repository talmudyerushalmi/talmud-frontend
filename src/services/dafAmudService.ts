import axiosInstance from './api';
import { Daf, iTractate, AmudMapping } from '../types/types';

export interface leanDaf {
  id: string;  // Hebrew letter (ב, ג, ד...)
  amudim: string[];  // Array of amud values (א, ב)
}

/**
 * Get the mapping for a specific Daf/Amud combination from tractate data
 */
export function getDafAmudMappingFromTractate(
  tractate: iTractate,
  daf: string,
  amud: string,
): Omit<AmudMapping, 'amud'> | null {
  if (!tractate.dafs) {
    return null;
  }

  const dafEntry = tractate.dafs.find(d => d.id === daf);
  if (!dafEntry) {
    return null;
  }

  // Find the FIRST occurrence of this amud for the chapter/halacha
  // (a mishna can span multiple amudim, we want the first one)
  const amudEntry = dafEntry.amudim.find(a => a.amud === amud);
  if (!amudEntry) {
    return null;
  }

  return {
    chapter: amudEntry.chapter,
    halacha: amudEntry.halacha,
    system_line: amudEntry.system_line,
  };
}

/**
 * Get all Dafs for a tractate from tractate data (no API call needed)
 */
export function getAllDafsFromTractate(tractate: iTractate): leanDaf[] {
  if (!tractate.dafs || tractate.dafs.length === 0) {
    return [];
  }

  // Each entry in tractate.dafs represents one daf with its amudim
  // The order is already correct from the database
  return tractate.dafs.map(daf => ({
    id: daf.id,
    amudim: Array.from(new Set(daf.amudim.map(a => a.amud))),
  }));
}

/**
 * Get all Amudim for a specific Daf from tractate data
 */
export function getAmudimsForDafFromTractate(
  tractate: iTractate,
  daf: string,
): string[] {
  if (!tractate.dafs) {
    return [];
  }

  // Find all amudim for this daf and return unique values
  // Order is preserved from the database
  const amudiSet = new Set<string>();
  tractate.dafs
    .filter(d => d.id === daf)
    .forEach(d => {
      d.amudim.forEach(a => amudiSet.add(a.amud));
    });

  return Array.from(amudiSet);
}
