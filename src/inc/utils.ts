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

// Comprehensive Hebrew number mapping (1-100) - used for both Chapter/Mishna and Daf/Amud
export const hebrewMap = new Map([
  ['all', 'כל הפרק'],
  ['001', 'א'], ['002', 'ב'], ['003', 'ג'], ['004', 'ד'], ['005', 'ה'],
  ['006', 'ו'], ['007', 'ז'], ['008', 'ח'], ['009', 'ט'], ['010', 'י'],
  ['011', 'יא'], ['012', 'יב'], ['013', 'יג'], ['014', 'יד'], ['015', 'טו'],
  ['016', 'טז'], ['017', 'יז'], ['018', 'יח'], ['019', 'יט'], ['020', 'כ'],
  ['021', 'כא'], ['022', 'כב'], ['023', 'כג'], ['024', 'כד'], ['025', 'כה'],
  ['026', 'כו'], ['027', 'כז'], ['028', 'כח'], ['029', 'כט'], ['030', 'ל'],
  ['031', 'לא'], ['032', 'לב'], ['033', 'לג'], ['034', 'לד'], ['035', 'לה'],
  ['036', 'לו'], ['037', 'לז'], ['038', 'לח'], ['039', 'לט'], ['040', 'מ'],
  ['041', 'מא'], ['042', 'מב'], ['043', 'מג'], ['044', 'מד'], ['045', 'מה'],
  ['046', 'מו'], ['047', 'מז'], ['048', 'מח'], ['049', 'מט'], ['050', 'נ'],
  ['051', 'נא'], ['052', 'נב'], ['053', 'נג'], ['054', 'נד'], ['055', 'נה'],
  ['056', 'נו'], ['057', 'נז'], ['058', 'נח'], ['059', 'נט'], ['060', 'ס'],
  ['061', 'סא'], ['062', 'סב'], ['063', 'סג'], ['064', 'סד'], ['065', 'סה'],
  ['066', 'סו'], ['067', 'סז'], ['068', 'סח'], ['069', 'סט'], ['070', 'ע'],
  ['071', 'עא'], ['072', 'עב'], ['073', 'עג'], ['074', 'עד'], ['075', 'עה'],
  ['076', 'עו'], ['077', 'עז'], ['078', 'עח'], ['079', 'עט'], ['080', 'פ'],
  ['081', 'פא'], ['082', 'פב'], ['083', 'פג'], ['084', 'פד'], ['085', 'פה'],
  ['086', 'פו'], ['087', 'פז'], ['088', 'פח'], ['089', 'פט'], ['090', 'צ'],
  ['091', 'צא'], ['092', 'צב'], ['093', 'צג'], ['094', 'צד'], ['095', 'צה'],
  ['096', 'צו'], ['097', 'צז'], ['098', 'צח'], ['099', 'צט'], ['100', 'ק'],
]);

export const localeMap = new Map([
  ['he', 'he-IL'],
  ['he-IL', 'he-IL'],
  ['en-US', 'en-US'],
]);

// Create reverse map: Hebrew → Number (derived from hebrewMap)
// This is generated once on module load for performance
const reverseHebrewMap = new Map<string, number>();
for (const [key, value] of hebrewMap.entries()) {
  if (key !== 'all') {
    const numericValue = parseInt(key, 10);
    reverseHebrewMap.set(value, numericValue);
  }
}

// Convert Hebrew letters to numbers for Daf display
// Now uses hebrewMap as the single source of truth
export function hebrewToNumber(hebrewLetter: string): number | string {
  return reverseHebrewMap.get(hebrewLetter) ?? hebrewLetter;
}

// Get Hebrew letter by 1-based index (1='א', 2='ב', etc.)
// Uses hebrewMap as single source of truth
export function getHebrewLetterByIndex(index: number): string {
  const key = String(index).padStart(3, '0'); // Convert 1 to '001', 2 to '002', etc.
  return hebrewMap.get(key) || '';
}

// Convert Hebrew Amud letters to English letters
export function hebrewAmudToEnglish(hebrewAmud: string): string {
  const mapping: { [key: string]: string } = {
    'א': 'a', 'ב': 'b', 'ג': 'c', 'ד': 'd', 'ה': 'e', 'ו': 'f',
  };
  return mapping[hebrewAmud] || hebrewAmud;
}
