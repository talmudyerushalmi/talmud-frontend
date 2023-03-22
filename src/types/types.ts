import { RawDraftContentState } from 'draft-js';
import { EditorSelectionObject } from '../inc/editorUtils';
import { iExcerptType } from '../inc/excerptUtils';

export interface iTractate {
  id: string;
  title_heb: string;
  chapters: iChapter[];
}
export interface iChapter {
  id: string;
  mishnaiot: iMishna[];
}
export interface iMishna {
  id: string;
  mishna: string;
  lines: iLine[];
  excerpts: iExcerpt[];
  richTextMishna: RawDraftContentState | null;
  previous?: iMarker;
  next?: iMarker;
}

export interface iMarker {
  tractate: string;
  chapter: string;
  mishna: string;
  lineFrom: string;
  lineTo: string;
}

export enum CompositionType {
  PARALLEL = 'parallel',
  EXCERPT = 'excerpt',
  YALKUT = 'yalkut',
}
export interface iSource {
  title: string;
  secondary_title: string;
  date: string;
  type: CompositionType;
  region: string;
  author: string;
}

export interface iExcerpt {
  key: number;
  automaticImport: boolean;
  editorStateFullQuote: RawDraftContentState;
  editorStateComments: RawDraftContentState;
  editorStateShortQuote: RawDraftContentState;
  synopsis: string;
  selection: EditorSelectionObject | null;
  type: iExcerptType;
  seeReference: boolean;
  source: iSource | null;
  sourceLocation?: string;
  flagNeedUpdate?: boolean;
  link?: string;
  short?: string;
}

export interface EditedText {
  simpleText: string;
  content?: RawDraftContentState;
  editor?: any; // maybe can be removed
}
export enum SourceType {
  DIRECT_SOURCES = 'direct_sources',
  INDIRECT_SOURCES = 'indirect_sources',
  TRANSLATION = 'translation',
}

export type sourceType = SourceType.DIRECT_SOURCES | SourceType.INDIRECT_SOURCES | SourceType.TRANSLATION;

export interface iSynopsis {
  text: EditedText;
  type: sourceType;
  name: string;
  id: string;
  code: string;
  button_code: string;
  manuscript?: string;
  composition?: iSynopsisComposition;
  location?: string;
}

interface iSynopsisComposition {
  composition: iSource;
  compositionLocation: string;
}

export interface iSubline {
  text: string;
  nosach: RawDraftContentState | null;
  index: number;
  synopsis: iSynopsis[];
  piska?: boolean;
  sugiaName?: string;
  offset?: number;
}

export interface iLine {
  text: string;
  originalLineNumber?: string;
  lineNumber?: string;
  sourceReference?: string;
  mainLine: string;
  sublines?: iSubline[];
  parallels?: iInternalLink[];
}

export interface iInternalLink {
  linkText: string;
  tractate: string;
  chapter: string;
  mishna: string;
  lineNumber: string;
}

export interface iComment {
  commentID: string;
  line: number;
  text: string;
  type: CommentType;
  tractate: string;
}

export interface iPostComment {
  tractate: string;
  line: number;
  text: string;
  type: Omit<CommentType, CommentType.PUBLIC>;
}

export interface iUpdateComment extends iPostComment {
  commentID: string;
}

export enum CommentType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  MODERATION = 'moderation',
}

export interface iComments {
  _id: string;
  userID: string;
  comments: iComment[];
}

export type iPublicCommentsByTractate = Omit<iComments, '_id'>;
