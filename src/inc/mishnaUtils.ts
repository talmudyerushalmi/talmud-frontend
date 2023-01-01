import { iLine, iMishna, iSubline } from '../types/types';
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
