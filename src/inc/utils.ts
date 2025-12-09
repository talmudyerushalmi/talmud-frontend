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
        tractate: mishnaDoc.next.tractate,
        chapter: mishnaDoc.next.chapter,
        mishna: mishnaDoc.next.mishna,
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
  if (!mishnaDoc) {
    return null;
  }

  // If no line number, navigate to previous mishna
  if (!lineNumber) {
    return mishnaDoc.previous || null;
  }

  // Try to move one line back within current mishna
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

  // Can't move back within current mishna, try to go to previous mishna
  if (mishnaDoc.previous) {
    return {
      tractate: mishnaDoc.previous.tractate,
      chapter: mishnaDoc.previous.chapter,
      mishna: mishnaDoc.previous.mishna,
      lineNumber: mishnaDoc.previous.lineTo,
    };
  }

  // Already at the first line of first mishna - can't go back
  return null;
}

export const hebrewMap = new Map([
  ['all', 'כל הפרק'],
  ['001', 'א'],
  ['002', 'ב'],
  ['003', 'ג'],
  ['004', 'ד'],
  ['005', 'ה'],
  ['006', 'ו'],
  ['007', 'ז'],
  ['008', 'ח'],
  ['009', 'ט'],
  ['010', 'י'],
  ['011', 'יא'],
  ['012', 'יב'],
  ['013', 'יג'],
  ['014', 'יד'],
  ['015', 'טו'],
  ['016', 'טז'],
  ['017', 'יז'],
  ['018', 'יח'],
  ['019', 'יט'],
  ['020', 'כ'],
  ['021', 'כא'],
  ['022', 'כב'],
  ['023', 'כג'],
]);

export const localeMap = new Map([
  ['he', 'he-IL'],
  ['he-IL', 'he-IL'],
  ['en-US', 'en-US'],
]);
