import { CharacterMetadata, convertToRaw, SelectionState } from "draft-js"

export function getRawText(editorState) {
  const content = editorState.getCurrentContent()
  const rawText = content
    .getBlocksAsArray()
    .reduce((carrier, b) => `${carrier}\n${b.getText()}`, "")
  return rawText
}

export function isContentEmpty(content) {
  return ((content?.blocks?.length===1) && (content.blocks[0].text==="") );
}

export function getExcerpt(content, size = 10) {
  const lines = content?.blocks.reduce((previous,block)=>previous + " " + block.text,"");
  const words = lines.split(" ");
  const reduced = words.length > size ? `${words.slice(0,size).join(" ")}...` 
  : words.slice(0,size).join(" ")
  return `<p>${reduced}</p>`;
}
// startSelection means we look back to find the word
// if false we look forward
const getWord = (text, offset, startSelection = true) => {
 // const endWords = /[\.\s]/

  const hebrewRegex = /[0-9א-ת'"[\](){}-]/
  const arrayText = text.trim().split("")
  let word = ""
  if (startSelection) {
    // get start

  } else {
    // find start - first offset with hebrew letter  
    while (offset > 0 && !hebrewRegex.test(arrayText[offset])) {
        offset--;
      }
   // offset--;
  }
  //console.log(`s: ${startSelection} current is ${arrayText[offset]}`)

  // if (endWords.test(arrayText[offset])) {
  //   return ""
  // }


  while (offset > 0 && hebrewRegex.test(arrayText[offset])) {
    offset--;
  }
  // if we stopped at a non hebrew character and it is the middle 
  // of the text - go one character forward
  if (offset>0) {offset++}

  //console.log("offset is now ", offset)
  //console.log("current is now", arrayText[offset])
  //
  while (arrayText.length > offset &&  hebrewRegex.test(arrayText[offset])) {
    word += arrayText[offset++]
  }
  return word
}

export function getSelectionObject(editorState) {
  const selectionState = editorState.getSelection()
  const currentContent = editorState.getCurrentContent()
  const startKey = selectionState.getStartKey()
  const fromOffset = selectionState.getStartOffset()
  const endKey = selectionState.getEndKey()
  const toOffset = selectionState.getEndOffset()
  const fromContentBlock = currentContent.getBlockForKey(startKey)
  const fromText = fromContentBlock.getText()
  const toContentBlock = currentContent.getBlockForKey(endKey)
  const toText = toContentBlock.getText()
  const fromWord = getWord(fromText, fromOffset)
  const toWord = getWord(toText, toOffset, false)

  const blockMap = currentContent.getBlocksAsArray()
  const fromLine = blockMap.findIndex(b => b.key === startKey)
  const toLine = blockMap.findIndex(b => b.key === endKey)


  return {
    fromLine,
    fromWord,
    fromOffset,
    toLine,
    toWord,
    toOffset
  }
}

export function getContentRaw(editorState) {
  return convertToRaw(editorState.getCurrentContent());
}

export function editorInEventPath(event) {
  return event.path.some(e =>  
   
    (e.classList &&
    e.classList?.value.indexOf("Editor")!==-1));
}

export function getSelectionStateFromExcerpt(excerpt,contentState) {
  let selectionState = SelectionState.createEmpty();
  const blocks = contentState.getBlocksAsArray();
  const selectionStartKey = blocks[excerpt.selection.fromLine].key;

  selectionState = selectionState.merge({
    "anchorKey":selectionStartKey,
    "anchorOffset":excerpt.selection.fromOffset,
    "focusKey":blocks[excerpt.selection.toLine].key,
    "focusOffset":excerpt.selection.toOffset
  });
  
  //console.log("selection state>>>>", selectionState)
  return selectionState
}


export function clearEntityRanges(contentState){
  const blockMap = contentState.getBlockMap()
  const blocks = blockMap.map((block) => {

    const chars = block.getCharacterList().map((char) => {
      const entityKey = char.getEntity()

      if (entityKey) {

        if (true) {
          return CharacterMetadata.applyEntity(char, null)
        }
      }

      return char
    })

    return  block.set("characterList", chars);
  })

  return contentState.merge({
    blockMap: blockMap.merge(blocks),
  })
}
