import { convertFromRaw, EditorState } from 'draft-js';
import { iSynopsis, SourceType } from '../types/types';
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
  if (synopsis.type === SourceType.TRANSLATION) {return str}
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
  ['leiden', { title: 'ל' }],
  ['leiden_2', { title: 'ל2' }],
  ['rome', { title: 'ר' }],
  ['escorial', { title: 'א' }],
  ['munich', { title: 'מ' }],
  ['oxford', { title: 'או' }],
  ['dfus_rishon', { title: 'ד' }],
  ['gniza_1', { title: 'ג1' }],
  ['gniza_2', { title: 'ג2' }],
  ['gniza_3', { title: 'ג3' }],
  ['gniza_4', { title: 'ג4' }],
  ['gniza_5', { title: 'ג5' }],
  ['gniza_6', { title: 'ג6' }],
  ['gniza_7', { title: 'ג7' }],
  ['gniza_8', { title: 'ג8' }],
  ['gniza_9', { title: 'ג9' }],
  ['gniza_10', { title: 'ג10' }],
  ['gniza_11', { title: 'ג11' }],
  ['kricha_1', { title: 'כ1' }],
  ['kricha_2', { title: 'כ2' }],
  ['kricha_3', { title: 'כ3' }],
  ['kricha_4', { title: 'כ4' }],
  ['kricha_5', { title: 'כ5' }],
  ['kricha_6', { title: 'כ6' }],
  ['kricha_7', { title: 'כ7' }],
  ['kricha_8', { title: 'כ8' }],
  ['kricha_13', { title: 'כ13' }],
  ['kricha_14', { title: 'כ14' }],
  ['likutim_2', { title: 'לק2' }],
  ['likutim_3', { title: 'לק3' }],
  ['likutim_4', { title: 'לק4' }],
  ['likutim_5', { title: 'לק5' }],
  ['likutim_12', { title: 'לק12' }],
  ['likutim_l_1', { title: 'לק-ל1' }],
  ['likutim_l_2', { title: 'לק-ל2' }],
  ['likutim_l_3', { title: 'לק-ל3' }],
  ['translation', { title: 'ת' }],
]);
