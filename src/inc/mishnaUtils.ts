import { iLine, iMishna } from '../types/types';
import * as _ from 'lodash';

export function getSublines(mishna: iMishna) {
  const lines = mishna.lines;
  const sublines = lines.map((line) => line.sublines);
  return _.flatten(sublines);
}

export function getSugiaLines(currentMishna: iMishna, line: iLine) {
  const lines = currentMishna.lines;
  const sublines = getSublines(currentMishna);
  const lineNextSugia = lines.find(
    (mishnaLine) => mishnaLine.sugiaName && parseInt(mishnaLine.lineNumber!) > parseInt(line.lineNumber!)
  );

  let lineSugiaEnd;
  if (lineNextSugia) {
    lineSugiaEnd = lines.find((l) => parseInt(l.lineNumber!) === parseInt(lineNextSugia.lineNumber!) - 1);
  } else {
    lineSugiaEnd = lines[lines.length - 1];
  }
  const sublineSugiaEnd = lineSugiaEnd.sublines[lineSugiaEnd.sublines.length - 1];
  const sublineStartIndex = line.sublines![0].index - 1;
  const sublineEndIndex = sublineSugiaEnd.index - 1;

  const sugiaSublines = sublines.splice(sublineStartIndex, sublineEndIndex - sublineStartIndex + 1);
  return sugiaSublines;
}
