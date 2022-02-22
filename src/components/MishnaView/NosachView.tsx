import {
  ContentState,
  convertFromRaw,
  EditorState,
  Modifier,
  SelectionState,
} from "draft-js";
import React, { useEffect, useState } from "react";
import { iExcerpt, iSubline } from "../../types/types";
import TextEditor from "../edit/MainLineEditor/TextEditor";
import { compoundNosachDecorators } from "../editors/EditorDecoratorNosach";

interface Props {
  subline: iSubline;
  markFrom?: number;
  markTo?: number;
  showPunctuation?: boolean;
  selectedExcerpt?: iExcerpt;
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

const removePunctuation = (editorState: EditorState) => {
  const regex = new RegExp("[-,.?]", "g");
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
    contentState = Modifier.replaceText(contentState, selectionState, "");
  });

  return EditorState.createWithContent(contentState, compoundNosachDecorators);
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
  content = Modifier.applyInlineStyle(content, updatedSelection, "MARK");

  const newEditorState = EditorState.createWithContent(
    content,
    compoundNosachDecorators
  );

  return newEditorState;
};

const NosachView = (props: Props) => {
  const { subline, markFrom, markTo, showPunctuation, selectedExcerpt } = props;

  const [editor, setEditor] = useState(EditorState.createEmpty());

  useEffect(() => {
    let newEditorState;
    if (subline.nosach) {
      let initContent = convertFromRaw(subline.nosach);
      newEditorState = EditorState.createWithContent(
        initContent,
        compoundNosachDecorators
      );
      if (!showPunctuation) {
        newEditorState = removePunctuation(newEditorState);
      }
      const length = newEditorState.getCurrentContent().getPlainText().length;
      if (selectedExcerpt && lineSelected(selectedExcerpt, subline)) {
        newEditorState = mark(newEditorState, 0, length);
      }
    } else {
      newEditorState = EditorState.createWithContent(
        ContentState.createFromText("")
      );
    }
    setEditor(newEditorState);
  }, [subline, markFrom, markTo, showPunctuation, selectedExcerpt]);

  return (
    <>
      <TextEditor
        selectionFrom={1}
        selectionTo={4}
        readOnly={true}
        initialState={editor}
      />
    </>
  );
};

export default NosachView;
