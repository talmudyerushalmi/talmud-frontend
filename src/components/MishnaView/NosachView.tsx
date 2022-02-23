import {
  ContentState,
  convertFromRaw,
  EditorState,
  Modifier,
  SelectionState,
} from "draft-js";
import React, { useEffect, useState } from "react";
import { ShowEditType } from "../../store/reducers/mishnaViewReducer";
import { iExcerpt, iSubline } from "../../types/types";
import TextEditor from "../edit/MainLineEditor/TextEditor";
import { compoundNosachDecorators, compoundOriginalDecorators } from "../editors/EditorDecoratorNosach";

interface Props {
  subline: iSubline;
  markFrom?: number;
  markTo?: number;
  showPunctuation?: boolean;
  showEditType: ShowEditType;
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

const getDecorator = (showEditType: ShowEditType) => {
  switch (showEditType) {
    case ShowEditType.EDITED:
      return compoundNosachDecorators
    case ShowEditType.ORIGINAL:
      return compoundOriginalDecorators
  }
}


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
    getDecorator(ShowEditType.ORIGINAL)
  );

  return newEditorState;
};

const NosachView = (props: Props) => {
  const { subline, markFrom, markTo, showPunctuation, selectedExcerpt, showEditType } = props;

  const [editor, setEditor] = useState(EditorState.createEmpty());

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
  
    return EditorState.createWithContent(contentState, getDecorator(showEditType));
  };

  useEffect(() => {
    let newEditorState;
    if (subline.nosach) {
      let initContent = convertFromRaw(subline.nosach);
      newEditorState = EditorState.createWithContent(
        initContent,
        getDecorator(showEditType)
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
  }, [subline, markFrom, markTo, showPunctuation, selectedExcerpt, showEditType]);

  // useEffect(()=>{
  //   let newEditorState;
  //   if (showEditType===ShowEditType.ORIGINAL) {
  //     newEditorState = EditorState.createWithContent(
  //       editor.getCurrentContent(),
  //       compoundOriginalDecorators
  //     );
  //   }
  //   if (showEditType===ShowEditType.EDITED) {
  //     newEditorState = EditorState.createWithContent(
  //       editor.getCurrentContent(),
  //       compoundNosachDecorators
  //     );
  //   }

  //   setEditor(newEditorState)
  // },[showEditType])

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
