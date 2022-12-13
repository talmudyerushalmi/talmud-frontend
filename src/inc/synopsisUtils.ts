import { convertFromRaw, EditorState } from 'draft-js';
import { iSynopsis } from '../types/types';
import { getRawText } from './editorUtils';

export function getSynopsisRaw(synopsis: iSynopsis) {
  if (synopsis.text.content) {
    const fromRaw = convertFromRaw(synopsis.text.content);
    const editor = EditorState.createWithContent(fromRaw);
    return getRawText(editor).trim();
  }
  return synopsis.text.simpleText;
}

export function getTextForSynopsis(str: string, synopsis: iSynopsis): string {
  const groupGnizaKricha = ['gniza', 'kricha'];
  const step1 = /(\(שם\)|''|\(.*?,.*?\)|<.*?>|\|.*?\||[.+:!{},])/g;
  const removeQuestionMark = /\?/g;
  const step2 = /[-]/g;
  // const step3 = /"(?<![א-ת]"(?=[א-ת]\s+))/g; // כל הגרשיים בין שתי אותיות יש להשאיר
  const step4 = /\s+/g;

  if (groupGnizaKricha.includes(synopsis?.code)) {
    return str
      ? str
          .replace(step1, '')
          .replace(step2, ' ')
          // .replace(step3, '')
          .replace(step4, ' ')
          .trim()
      : '';
  } else {
    return str
      ? str
          .replace(step1, '')
          .replace(removeQuestionMark, '')
          .replace(step2, ' ')
          //   .replace(step3, '')
          .replace(step4, ' ')
          .trim()
      : '';
  }
}

export function clearPunctutationFromText(str) {
  const step1 = /(''|\|.*?\||[.+:?!"{},])/g;
  const step2 = /[-]/g;
  const step3 = /\s+/g;
  return str ? str.replace(step1, '').replace(step2, ' ').replace(step3, ' ').trim() : '';
}

export function hideSourceFromText(str) {
  const step1 = /(\(שם\)|\([^(]+?,[^)]+?\)\s+|''|\([^(]*?,[^)]*?\)|<.*?,.*?>)/g;
  return str ? str.replace(step1, '').trim() : '';
}

export const synopsisMap = new Map([
  [
    'leiden',
    {
      title: 'ל',
    },
  ],
  [
    'dfus_rishon',
    {
      title: 'ד',
    },
  ],
  [
    'kricha_2',
    {
      title: 'כ2',
    },
  ],
]);
