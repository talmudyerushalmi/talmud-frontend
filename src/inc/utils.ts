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

// Convert Hebrew letters to numbers for Daf display
export function hebrewToNumber(hebrewLetter: string): number | string {
  const mapping: { [key: string]: number } = {
    'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9, 'י': 10,
    'יא': 11, 'יב': 12, 'יג': 13, 'יד': 14, 'טו': 15, 'טז': 16, 'יז': 17, 'יח': 18, 'יט': 19, 'כ': 20,
    'כא': 21, 'כב': 22, 'כג': 23, 'כד': 24, 'כה': 25, 'כו': 26, 'כז': 27, 'כח': 28, 'כט': 29, 'ל': 30,
    'לא': 31, 'לב': 32, 'לג': 33, 'לד': 34, 'לה': 35, 'לו': 36, 'לז': 37, 'לח': 38, 'לט': 39, 'מ': 40,
    'מא': 41, 'מב': 42, 'מג': 43, 'מד': 44, 'מה': 45, 'מו': 46, 'מז': 47, 'מח': 48, 'מט': 49, 'ן': 50,
  };
  return mapping[hebrewLetter] || hebrewLetter;
}

// Convert Hebrew Amud letters to English letters
export function hebrewAmudToEnglish(hebrewAmud: string): string {
  const mapping: { [key: string]: string } = {
    'א': 'a', 'ב': 'b', 'ג': 'c', 'ד': 'd', 'ה': 'e', 'ו': 'f',
  };
  return mapping[hebrewAmud] || hebrewAmud;
}
