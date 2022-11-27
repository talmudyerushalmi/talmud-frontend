import * as numeral from 'numeral';
import { iMishnaForNavigation } from '../components/shared/ChooseMishnaBar';

export function getNextLine(
  tractate: string,
  chapter: string,
  mishna: string,
  line: string,
  mishnaDoc: iMishnaForNavigation | null
) {
  if (!mishnaDoc) {
    return null;
  }
  const nextLine = numeral(parseInt(line) + 1).format('00000');
  const lineObj = mishnaDoc?.lines?.find((lineItem) => lineItem === nextLine);
  if (lineObj) {
    return {
      tractate,
      chapter,
      mishna,
      line: nextLine,
    };
  } else {
    if (mishnaDoc.next) {
      return {
        ...mishnaDoc.next,
        line: mishnaDoc.next.lineFrom,
      };
    } else return null;
  }
}

export function getPreviousLine(
  tractate: string,
  chapter: string,
  mishna: string,
  line: string,
  mishnaDoc: iMishnaForNavigation | null
) {
  if (!mishnaDoc) {
    return null;
  }

  // if first line return
  if (line === '00001' && chapter === '001') {
    return {
      tractate,
      chapter,
      mishna,
      line,
    };
  }
  // if can move one line before
  let previousLine = numeral(parseInt(line) - 1).format('00000');
  const lineObj = mishnaDoc?.lines?.find((lineItem) => lineItem === previousLine);
  if (lineObj) {
    return {
      tractate,
      chapter,
      mishna,
      line: previousLine,
    };
  }
  // else need to move mishna before
  else if (mishnaDoc.previous) {
    return {
      ...mishnaDoc.previous,
      line: mishnaDoc.previous.lineTo,
    };
  }
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
