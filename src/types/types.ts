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
  richTextMishna: RawDraftContentState|null

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
  flagBadSelection?: boolean;
}

export interface EditedText {
  simpleText: string;
  content?: RawDraftContentState;
  editor?: any, // maybe can be removed
}

export type sourceType = "direct_sources" | "indirect_sources";

export interface iSynopsis {
  text: EditedText;
  type: sourceType;
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
  sugiaName?: string;
}
