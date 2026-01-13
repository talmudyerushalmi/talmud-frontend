import { ContentState, convertFromRaw, EditorState, Modifier, SelectionState } from 'draft-js';
import React, { useCallback, useEffect, useState } from 'react';
import { ShowEditType } from '../../store/reducers/mishnaViewReducer';
import { iExcerpt, iSubline } from '../../types/types';
import TextEditor from '../edit/MainLineEditor/TextEditor';
import {
  compoundCombinedDecorators,
  compoundEditedNosachDecorators,
  compoundOriginalDecorators,
} from '../editors/EditorDecoratorNosach';

interface Props {
  subline: iSubline;
  markFrom?: number;
  markTo?: number;
  showPunctuation?: boolean;
  showEditType: ShowEditType;
  selectedExcerpt?: iExcerpt;
  dafAmudMarker?: {
    line: string;
    word_pos: number;
    daf: string;
    amud: string;
  };
}

const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr, start, end;
  let numberOfFinds = 0;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index - numberOfFinds++;
    end = start + matchArr[0].length;
    callback(start, end);
  }
};

const getDecorator = (showEditType: ShowEditType) => {
  switch (showEditType) {
    case ShowEditType.EDITED:
      return compoundEditedNosachDecorators;
    case ShowEditType.ORIGINAL:
      return compoundOriginalDecorators;
    case ShowEditType.COMBINED:
      return compoundCombinedDecorators;
  }
};

const lineSelected = (excerpt: iExcerpt, subline: iSubline) => {
  if (!(excerpt && excerpt.selection)) {
    return false;
  }
  return (
    excerpt.selection.fromSubline &&
    excerpt.selection.fromSubline <= subline.index &&
    excerpt.selection.toSubline &&
    excerpt.selection.toSubline >= subline.index
  );
};

const mark = (editorState: EditorState, markFrom, markTo) => {
  let selectionState = editorState.getSelection();
  let content = editorState.getCurrentContent();
  var updatedSelection = selectionState.merge({
    anchorOffset: markFrom ? markFrom : 0,
    focusOffset: Math.min(markTo, content.getPlainText().length),
  });
  content = Modifier.applyInlineStyle(content, updatedSelection, 'MARK');

  const newEditorState = EditorState.createWithContent(content, getDecorator(ShowEditType.ORIGINAL));

  return newEditorState;
};

const insertDafAmudMarker = (editorState: EditorState, wordPos: number, daf: string, amud: string, showEditType: ShowEditType) => {
  const contentState = editorState.getCurrentContent();
  const text = contentState.getPlainText();
  
  console.log('insertDafAmudMarker - Full text:', text);
  console.log('insertDafAmudMarker - wordPos:', wordPos);
  
  // Split text into words (Hebrew text is RTL but we count words left-to-right in the string)
  const words = text.split(/\s+/).filter(w => w.length > 0);
  
  console.log('insertDafAmudMarker - words:', words);
  console.log('insertDafAmudMarker - total words:', words.length);
  
  // Find the character position after the specified word
  let charPos = 0;
  for (let i = 0; i < Math.min(wordPos, words.length); i++) {
    charPos += words[i].length;
    if (i < wordPos) {
      charPos += 1; // Add space after the word
    }
  }
  
  console.log('insertDafAmudMarker - charPos:', charPos);
  
  // Create the marker text
  const markerText = `[${daf}:${amud}] `;
  
  // Create a selection at the insert position
  const blockKey = contentState.getFirstBlock().getKey();
  const selection = SelectionState.createEmpty(blockKey).merge({
    anchorOffset: charPos,
    focusOffset: charPos,
  });
  
  // Insert the marker
  const newContentState = Modifier.insertText(contentState, selection, markerText);
  
  console.log('insertDafAmudMarker - text after insert:', newContentState.getPlainText());
  
  return EditorState.createWithContent(newContentState, getDecorator(showEditType));
};

const NosachView = (props: Props) => {
  const { subline, markFrom, markTo, showPunctuation, selectedExcerpt, showEditType, dafAmudMarker } = props;

  const [editor, setEditor] = useState(EditorState.createEmpty());

  const memoizedRemovePunctuation = useCallback(
    (editorState: EditorState) => {
      const regex = new RegExp('[-,.?]', 'g');
      const selectionsToReplace: SelectionState[] = [];
      const blockMap = editorState.getCurrentContent().getBlockMap();

      blockMap.forEach((contentBlock) =>
        findWithRegex(regex, contentBlock, (start, end) => {
          if (!contentBlock) {
            return;
          }
          const blockKey = contentBlock.getKey();
          const blockSelection = SelectionState.createEmpty(blockKey).merge({
            anchorOffset: start,
            focusOffset: end,
          });

          selectionsToReplace.push(blockSelection);
        })
      );

      let contentState = editorState.getCurrentContent();

      selectionsToReplace.forEach((selectionState) => {
        contentState = Modifier.replaceText(contentState, selectionState, '');
      });

      return EditorState.createWithContent(contentState, getDecorator(showEditType));
    },
    [showEditType]
  );

  useEffect(() => {
    let newEditorState;
    if (subline.nosach) {
      let initContent = convertFromRaw(subline.nosach);
      newEditorState = EditorState.createWithContent(initContent, getDecorator(showEditType));
      if (!showPunctuation) {
        newEditorState = memoizedRemovePunctuation(newEditorState);
      }
      const length = newEditorState.getCurrentContent().getPlainText().length;
      if (selectedExcerpt && lineSelected(selectedExcerpt, subline)) {
        newEditorState = mark(newEditorState, 0, length);
      }
      
      // Insert Daf/Amud marker if present
      if (dafAmudMarker && dafAmudMarker.word_pos) {
        console.log('NosachView - Inserting marker:', dafAmudMarker);
        console.log('NosachView - Text before insert:', newEditorState.getCurrentContent().getPlainText());
        newEditorState = insertDafAmudMarker(
          newEditorState,
          dafAmudMarker.word_pos,
          dafAmudMarker.daf,
          dafAmudMarker.amud,
          showEditType
        );
        console.log('NosachView - Text after insert:', newEditorState.getCurrentContent().getPlainText());
      }
    } else {
      newEditorState = EditorState.createWithContent(ContentState.createFromText(''));
    }
    setEditor(newEditorState);
  }, [subline, markFrom, markTo, showPunctuation, selectedExcerpt, showEditType, memoizedRemovePunctuation, dafAmudMarker]);

  // Use a key that includes marker info to force re-render when marker is added
  const editorKey = dafAmudMarker 
    ? `${subline.index}-${dafAmudMarker.daf}-${dafAmudMarker.amud}` 
    : `${subline.index}`;
    
  return <TextEditor key={editorKey} selectionFrom={1} selectionTo={4} readOnly={true} initialState={editor} />;
};

export default NosachView;
