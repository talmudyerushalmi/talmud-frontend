import * as numeral from 'numeral';
import { iLink } from '../types/types';
import { iMishnaForNavigation } from '../components/shared/ChooseMishna/ChooseMishna';

export function getNext(
  tractate: string,
  chapter: string,
  mishna: string,
  line: string,
  mishnaDoc: iMishnaForNavigation | null
): iLink | null {
  if (!mishnaDoc?.next) {
    return null;
  }
  if (!line) {
    return mishnaDoc.next;
  }
  const nextLine = numeral(parseInt(line) + 1).format('00000');
  const lineObj = mishnaDoc?.lines?.find((lineItem) => lineItem.lineNumber === nextLine);
  if (lineObj) {
    return {
      tractate,
      chapter,
      mishna,
      lineNumber: nextLine,
    };
  } else {
    if (mishnaDoc.next) {
      return {
        ...mishnaDoc.next,
        lineNumber: mishnaDoc.next.lineFrom,
      };
    } else return null;
  }
}

export function getPrevious(
  tractate: string,
  chapter: string,
  mishna: string,
  lineNumber: string,
  mishnaDoc: iMishnaForNavigation | null
): iLink | null {
  if (!mishnaDoc?.previous) {
    return null;
  }
  if (!lineNumber) {
    return mishnaDoc.previous;
  }
  if (!mishnaDoc) {
    return null;
  }

  // if first line return
  if (lineNumber === '00001' && chapter === '001') {
    return {
      tractate,
      chapter,
      mishna,
      lineNumber,
    };
  }
  // if can move one line before
  let previousLine = numeral(parseInt(lineNumber) - 1).format('00000');
  const lineObj = mishnaDoc?.lines?.find((lineItem) => lineItem.lineNumber === previousLine);
  if (lineObj) {
    return {
      tractate,
      chapter,
      mishna,
      lineNumber: previousLine,
    };
  }
  // else need to move mishna before
  else if (mishnaDoc.previous) {
    return {
      ...mishnaDoc.previous,
      lineNumber: mishnaDoc.previous.lineTo,
    };
  }
  return null
}
export const hebrewMap = new Map([
  [0, 'כל הפרק'],
  [1, 'א'],
  [2, 'ב'],
  [3, 'ג'],
  [4, 'ד'],
  [5, 'ה'],
  [6, 'ו'],
  [7, 'ז'],
  [8, 'ח'],
  [9, 'ט'],
  [10, 'י'],
  [11, 'יא'],
  [12, 'יב'],
  [13, 'יג'],
  [14, 'יד'],
  [15, 'טו'],
  [16, 'טז'],
  [17, 'יז'],
  [18, 'יח'],
  [19, 'יט'],
  [20, 'כ'],
  [21, 'כא'],
  [22, 'כב'],
  [23, 'כג'],
]);
