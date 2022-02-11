import {
  ContentState,
  convertFromRaw,
  EditorState,
  Modifier,
} from "draft-js";
import React, { useEffect, useState } from "react";
import { iSubline } from "../../types/types";
import TextEditor from "../edit/MainLineEditor/TextEditor";

interface Props {
  subline: iSubline;
  markFrom?: number;
  markTo?: number;
}

const mark = (editorState: EditorState, markFrom, markTo) => {
  let selectionState = editorState.getSelection();
  let content = editorState.getCurrentContent();
  var updatedSelection = selectionState.merge({
    anchorOffset: markFrom?markFrom:0,
    focusOffset: Math.min(markTo, content.getPlainText().length),
  });
  content = Modifier.applyInlineStyle(
    content,
    updatedSelection,
    "MARK"
  );

  const newEditorState = EditorState.createWithContent(
    content
    //compoundNosachDecorators
  );
  return newEditorState
};


const NosachView = (props: Props) => {
  const { subline, markFrom, markTo } = props;

  const [editor, setEditor] = useState(EditorState.createEmpty());

  useEffect(() => {
    let newEditorState;
    if (subline.nosach) {
      let initContent = convertFromRaw(subline.nosach);
      newEditorState = EditorState.createWithContent(
        initContent
        //compoundNosachDecorators
      );
      if (markTo) {
          newEditorState = mark(newEditorState, markFrom, markTo)
      }
    } else {
      newEditorState = EditorState.createWithContent(
        ContentState.createFromText("")
        //  compoundNosachDecorators
      );
    }
    setEditor(newEditorState);
  }, [subline, markFrom, markTo]);

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
