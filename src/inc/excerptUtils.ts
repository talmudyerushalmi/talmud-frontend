import { ContentState, convertToRaw } from "draft-js";
import { iExcerpt, iSubline } from "../types/types";

export const MUVAA = "MUVAA";
export const MAKBILA = "MAKBILA";
export const NOSACH = "NOSACH";

export type iExcerptType = "MUVAA" | "MAKBILA" | "NOSACH" | null;

export const excerptsMap = new Map([
  [
    MUVAA,
    {
      title: "Citations",
    },
  ],
  [
    MAKBILA,
    {
      title: "Talmudic Parallels",
    },
  ],
  [
    NOSACH,
    {
      title: "Editing comments",
    },
  ],
]);

export const getExcerptTitle = (excerpt: iExcerpt): string => {
  if (excerpt?.type && ['MUVAA','MAKBILA'].includes(excerpt.type as string)) {
    return `${excerpt?.source?.title} (${excerpt?.sourceLocation})`
  }
  return excerpt?.sourceLocation ? excerpt.sourceLocation : ''

}
export const getEmptyExcerpt = (): iExcerpt => {
  const emptyContent = convertToRaw(ContentState.createFromText(""));
  return {
    key: Date.now(),
    automaticImport: false,
    editorStateFullQuote: emptyContent,
    editorStateComments: emptyContent,
    editorStateShortQuote: emptyContent,
    synopsis: "",
    selection: null,
    type: "MUVAA",
    seeReference: false,
    source: null
  }
}
export const excerptSelection = (subline: iSubline, excerpt: iExcerpt) => {
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
    to: 0
  };
  if (subline.index === excerpt.selection.fromSubline) {
    subline.text.indexOf(excerpt.selection.fromWord);
    selection.from = subline.text.indexOf(excerpt.selection.fromWord.trim());
    selection.to = subline.text.length;
  }
  if (subline.index === excerpt.selection.toSubline) {
    selection.to =
      subline.text.indexOf(excerpt.selection.toWord.trim()) +
      excerpt.selection.toWord.trim().length;
  }
  if (
    subline.index > excerpt.selection.fromSubline &&
    subline.index < excerpt.selection.toSubline
  ) {
    selection.from = 0;
    selection.to = subline.text.length;
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
