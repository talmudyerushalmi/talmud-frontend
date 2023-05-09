import { ContentState, convertToRaw } from 'draft-js';
import { EXCERPT_TYPE } from '../components/edit/EditMishna/ExcerptDialog';
import { iComment, iExcerpt, iPublicCommentsByTractate, iSubline } from '../types/types';
import { getOffsetOfWordOccurence } from './textUtils';

export const MUVAA = 'MUVAA';
export const MAKBILA = 'MAKBILA';
export const NOSACH = 'NOSACH';

export type iExcerptType = 'MUVAA' | 'MAKBILA' | 'NOSACH' | null;

export const excerptsMap = new Map([
  [
    EXCERPT_TYPE.MUVAA,
    {
      title: 'Citations',
    },
  ],
  [
    EXCERPT_TYPE.MAKBILA,
    {
      title: 'Talmudic Parallels',
    },
  ],
  [
    EXCERPT_TYPE.NOSACH,
    {
      title: 'Editing Comments',
    },
  ],
  [
    EXCERPT_TYPE.BIBLIO,
    {
      title: 'Bibliographic Notes',
    },
  ],
  [
    EXCERPT_TYPE.EXPLANATORY,
    {
      title: 'Explanatory Notes',
    },
  ],
  [
    EXCERPT_TYPE.DICTIONARY,
    {
      title: 'Dictionary',
    },
  ],
  [
    EXCERPT_TYPE.COMMENT,
    {
      title: 'Public Comments',
    }
  ]
]);

export const getExcerptTitle = (excerpt: iExcerpt): string => {
  if (excerpt?.type && ['MUVAA', 'MAKBILA'].includes(excerpt.type as string)) {
    return `${excerpt?.source?.title} (${excerpt?.sourceLocation})`;
  }
  return excerpt?.sourceLocation ? excerpt.sourceLocation : '';
};
export const getEmptyExcerpt = (): iExcerpt => {
  const emptyContent = convertToRaw(ContentState.createFromText(''));
  return {
    key: Date.now(),
    automaticImport: false,
    editorStateFullQuote: emptyContent,
    editorStateComments: emptyContent,
    editorStateShortQuote: emptyContent,
    synopsis: '',
    selection: null,
    type: 'MUVAA',
    seeReference: false,
    source: null,
  };
};

export const excerptSelection = (text: string, subline: iSubline, excerpt: iExcerpt) => {
  if (
    !excerpt ||
    excerpt.selection?.fromWord === undefined ||
    excerpt.selection?.toWord === undefined ||
    excerpt.selection?.fromSubline === undefined ||
    excerpt.selection?.toSubline === undefined
  ) {
    return null;
  }

  let selection = {
    from: 0,
    to: 0,
  };
  if (subline.index === excerpt.selection.fromSubline) {
    selection.from =
      excerpt.selection.fromWord === ''
        ? 0
        : getOffsetOfWordOccurence(text, excerpt.selection.fromWord, excerpt.selection.fromWordOccurenceSubline);
    //subline.text.indexOf(excerpt.selection.fromWord.trim());
    selection.to = subline.text.length;
  }
  if (subline.index === excerpt.selection.toSubline) {
    selection.to =
      excerpt.selection.toWord === ''
        ? subline.text.length
        : getOffsetOfWordOccurence(text, excerpt.selection.toWord, excerpt.selection.toWordOccurenceSubline) +
          excerpt.selection.toWord.trim().length;
  }
  if (subline.index > excerpt.selection.fromSubline && subline.index < excerpt.selection.toSubline) {
    selection.from = 0;
    selection.to = text.length;
  }
  return selection;
};

export const getSelectionRange = (excerpt) => {
  if (!excerpt) {
    return null;
  }
  return excerpt?.selection?.fromSubline === excerpt?.selection?.toSubline
    ? `${excerpt.selection.fromSubline}`
    : `${excerpt.selection.fromSubline}-${excerpt.selection.toSubline}`;
};

export const excerptInSubline = (excerpt: iExcerpt, subline: iSubline) => {
  return subline.index >= excerpt.selection!.fromSubline! && subline.index <= excerpt.selection!.toSubline!;
};

export const commentInLines = (comment: iComment | iPublicCommentsByTractate, fromLine?: number, toLine?: number) => {
  if (!fromLine || !toLine) {
    return false;
  }
  return comment.line >= fromLine && comment.line <= toLine;
};
