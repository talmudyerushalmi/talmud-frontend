import { iMishna, iSubline } from '../types/types';
import * as _ from 'lodash';

export function getSublines(mishna: iMishna) {
  const lines = mishna.lines;
  const sublines = lines.map((line) => line.sublines);
  return _.flatten(sublines);
}

export function getSugiaLines(currentMishna: iMishna, sugiaSubline: iSubline) {
  const sublines = getSublines(currentMishna);
  const lineNextSugia = sublines.find((subline) => subline?.sugiaName && subline.index > sugiaSubline.index);
  let lineSugiaEnd;
  let sugiaSublines;
  if (lineNextSugia) {
    lineSugiaEnd = lineNextSugia;
    sugiaSublines = sublines.slice(sugiaSubline.index - 1, lineSugiaEnd.index - 1);
  } else {
    sugiaSublines = sublines.slice(sugiaSubline.index - 1, sublines.length);
  }

  return sugiaSublines;
}

/**
 * Simple utility functions for extracting data from mishna GUID
 */

type GuidObject = { guid?: string; id?: string; };

/**
 * Gets the tractate from any object with guid or id property
 */
export function getTractate(data: GuidObject): string {
  const guid = data.guid || data.id;
  if (!guid) return '';
  
  const parts = guid.split('_');
  return parts[0] || '';
}

/**
 * Gets the chapter from any object with guid or id property
 */
export function getChapter(data: GuidObject): string {
  const guid = data.guid || data.id;
  if (!guid) return '';
  
  const parts = guid.split('_');
  return parts[1] || '';
}

/**
 * Gets the mishna from any object with guid or id property
 */
export function getMishna(data: GuidObject): string {
  const guid = data.guid || data.id;
  if (!guid) return '';
  
  const parts = guid.split('_');
  return parts[2] || '';
}
