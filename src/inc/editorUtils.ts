import {
  CharacterMetadata,
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
  RawDraftContentState,
  SelectionState,
} from "draft-js";
import { iLine, iMishna } from "../types/types";
export interface editorSelection {
  startBlock?: string;
  startOffset?: number;
  endBlock?: string;
  endOffset?: number;
  time?: number;
}

export const getSelection = (editorState: EditorState): editorSelection => {
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();
  const focusKey = selectionState.getFocusKey();
  const start = selectionState.getStartOffset();
  const end = selectionState.getEndOffset();
  return {
    startBlock: anchorKey,
    startOffset: start,
    endBlock: focusKey,
    endOffset: end,
    time: Date.now(),
  };
};

export function getEditorFromLines(lines: string[]){
  const text =  lines.reduce((carrier, line)=> `${carrier}${line.trim()}\n`, "").trim();
  return EditorState.createWithContent(
    ContentState.createFromText(text)
  )
}

export function getHTMLFromRawContent(rawContent: RawDraftContentState|null): string|null {
  if (!rawContent) {return ""}
  const content = convertFromRaw(rawContent);
  const rawText = getHTMLFromContent(content)
  return rawText;
}

export function getHTMLFromContent(contentState: ContentState|null): string|null {
  if (!contentState) {
    return null
  }
  const rawHTML = contentState
    .getBlocksAsArray()
    .reduce((carrier, b) => `${carrier}<br>${b.getText()}`, "");

  return rawHTML.slice(4); // remove first <br>
}

export function getRawTextFromContent(contentState: ContentState): string {
  const rawText = contentState
    .getBlocksAsArray()
    .reduce((carrier, b) => `${carrier}\n${b.getText()}`, "");
  return rawText;
}


export function getRawText(editorState) {
  const content = editorState.getCurrentContent();
  return getRawTextFromContent(content);
}

export function getSublinesFromContent(editorState: EditorState) {
  const content = editorState.getCurrentContent();
  return content.getBlocksAsArray().map((block) => block.getText().trim());
}

export function getContentFromSublines(line: iLine) {}
export function isContentEmpty(content) {
  return content?.blocks?.length === 1 && content.blocks[0].text === "";
}

export function getExcerpt(content, size = 10) {
  const lines = content?.blocks.reduce(
    (previous, block) => previous + " " + block.text,
    ""
  );
  const words = lines.split(" ");
  const reduced =
    words.length > size
      ? `${words.slice(0, size).join(" ")}...`
      : words.slice(0, size).join(" ");
  return `<p>${reduced}</p>`;
}
// startSelection means we look back to find the word
// if false we look forward
const getWord = (text, offset, startSelection = true) => {
  // const endWords = /[\.\s]/

  const hebrewRegex = /[0-9א-ת'"[\](){}-]/;
  const arrayText = text.trim().split("");
  let word = "";
  if (startSelection) {
  } else {
    // find start - first offset with hebrew letter
    while (offset > 0 && !hebrewRegex.test(arrayText[offset])) {
      offset--;
    }
    // offset--;
  }

  while (offset > 0 && hebrewRegex.test(arrayText[offset])) {
    offset--;
  }
  // if we stopped at a non hebrew character and it is the middle
  // of the text - go one character forward
  if (offset > 0) {
    offset++;
  }

  //console.log("offset is now ", offset)
  //console.log("current is now", arrayText[offset])
  //
  while (arrayText.length > offset && hebrewRegex.test(arrayText[offset])) {
    word += arrayText[offset++];
  }
  return word;
};

export interface EditorSelectionObject {
  fromLine?: number;
  fromWord?: string;
  fromOffset?: number;
  fromSubline?: number;
  toLine?: number;
  toWord?: string;
  toOffset?: number;
  toSubline?: number;
  firstWords?: string;
}

function getFirstWords(fromText, toText, fromOffset, toOffset): string {
  const MAX_STRING = 30;
  let text;
  if (fromText === toText) {
    text = fromText.slice(fromOffset, toOffset).trim();
  } else {
    text = fromText.slice(fromOffset).trim();
  }
  if (text.length < MAX_STRING) {
    return text;
  } else {
    return text.substr(0, MAX_STRING) + "...";
  }
}
export function getSelectionObject(
  editorState: EditorState
): EditorSelectionObject {
  const selectionState = editorState.getSelection();
  const currentContent = editorState.getCurrentContent();
  const startKey = selectionState.getStartKey();
  const fromOffset = selectionState.getStartOffset();
  const endKey = selectionState.getEndKey();
  const toOffset = selectionState.getEndOffset();
  const fromContentBlock = currentContent.getBlockForKey(startKey);
  const fromText = fromContentBlock.getText();
  const toContentBlock = currentContent.getBlockForKey(endKey);
  const toText = toContentBlock.getText();
  const fromWord = getWord(fromText, fromOffset);
  const toWord = getWord(toText, toOffset, false);
  const firstWords = getFirstWords(fromText, toText, fromOffset, toOffset);
  const blockMap = currentContent.getBlocksAsArray();
  const fromLine = blockMap.findIndex((b) => b.getKey() === startKey);
  const toLine = blockMap.findIndex((b) => b.getKey() === endKey);

  return {
    fromLine,
    fromWord,
    fromOffset,
    toLine,
    toWord,
    toOffset,
    firstWords,
  };
}

export function getContentRaw(editorState) {
  return convertToRaw(editorState.getCurrentContent());
}

export function editorInEventPath(event) {
  return event.path.some(
    (e) => e.classList && e.classList?.value.indexOf("Editor") !== -1
  );
}

function getLineText(line: iLine) {
  if (line.sublines) {
    const numberOfSublines = line.sublines.length;
    let text = line.sublines.reduce((carrier, subline, currentIndex) => {
      return currentIndex < numberOfSublines - 1
        ? carrier + subline.text + ""
        : carrier + subline.text;
    }, "");
    // remove new lines/carriage return
    text = text.replace(/^\s+|\s+|\r+$/g, " ");
    return text;
  } else {
    return line.mainLine;
  }
}
export function getContentFromMishna(mishna: iMishna): ContentState {
  const text = mishna.lines.reduce((carrier, line, currentIndex) => {
    const lineText = getLineText(line);
    return currentIndex < mishna.lines.length - 1
      ? carrier + lineText + "\n"
      : carrier + lineText;
  }, "");
  return ContentState.createFromText(text);
}
export function getSelectionStateFromExcerpt(excerpt, contentState) {
  let selectionState = SelectionState.createEmpty("");
  const blocks = contentState.getBlocksAsArray();
  const selectionStartKey = blocks[excerpt.selection.fromLine].key;

  selectionState = selectionState.merge({
    anchorKey: selectionStartKey,
    anchorOffset: excerpt.selection.fromOffset,
    focusKey: blocks[excerpt.selection.toLine].key,
    focusOffset: excerpt.selection.toOffset,
  });

  //console.log("selection state>>>>", selectionState)
  return selectionState;
}

export function clearEntityRanges(contentState) {
  const blockMap = contentState.getBlockMap();
  const blocks = blockMap.map((block) => {
    const chars = block.getCharacterList().map((char) => {
      const entityKey = char.getEntity();

      if (entityKey) {
        if (true) {
          return CharacterMetadata.applyEntity(char, null);
        }
      }

      return char;
    });

    return block.set("characterList", chars);
  });

  return contentState.merge({
    blockMap: blockMap.merge(blocks),
  });
}
