import { RawDraftContentState } from "draft-js";
import { EditorSelectionObject } from "../inc/editorUtils";
import { iExcerptType } from "../inc/excerptUtils";


export interface iTractate {
  id: string;
  chapters: iChapter[]
}
export interface iChapter {
  id: string;
  mishnaiot: iMishna[]
}
export interface iMishna {
  id: string;
  mishna: string;
  lines: iLine[]
  excerpts: iExcerpt[]

}

export interface iSource {
  title: string;
  secondary_title: string;
  date: string;
  type: string;
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
}
export interface iSource {
  id: string;
  type: string;
  code: string;
  name: string;
  button_code: string;
}

export interface EditedText {
  simpleText: string;
  content: RawDraftContentState;
}

export interface iSynopsis {
  text: EditedText;
  type: string;
  name: string;
  id: string;
  code: string;
  button_code: string;
  manuscript?: string;
}

export interface iSubline {
  text: string;
  index: number;
  synopsis: iSynopsis[];
  piska?: boolean;
  offset?: number;
}

export interface iLine {
  text: string;
  originalLineNumber?: string;
  lineNumber?: string;
  sourceReference?: string;
  mainLine: string;
  sublines?: iSubline[];
}
