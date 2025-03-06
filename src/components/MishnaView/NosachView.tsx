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
import { CompositeDecorator } from 'draft-js';

interface Props {
  subline: iSubline;
  markFrom?: number;
  markTo?: number;
  showPunctuation?: boolean;
  showEditType: ShowEditType;
  selectedExcerpt?: iExcerpt;
  searchTerm?: string;
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

const findSearchTerm = (searchTerm) => {
  return (contentBlock, callback, contentState) => {
    if (!searchTerm) return;

    const text = contentBlock.getText();
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    let matchArr;

    while ((matchArr = regex.exec(text)) !== null) {
      const start = matchArr.index;
      const end = start + matchArr[0].length;
      callback(start, end);
    }
  };
};

const SearchHighlight = (props) => {
  return <span style={{ backgroundColor: 'yellow', padding: '0 2px' }}>{props.children}</span>;
};

const getDecorator = (showEditType: ShowEditType, searchTerm?: string) => {
  let baseDecorator;
  switch (showEditType) {
    case ShowEditType.EDITED:
      baseDecorator = compoundEditedNosachDecorators;
      break;
    case ShowEditType.ORIGINAL:
      baseDecorator = compoundOriginalDecorators;
      break;
    case ShowEditType.COMBINED:
      baseDecorator = compoundCombinedDecorators;
      break;
    default:
      baseDecorator = compoundOriginalDecorators;
  }

  if (!searchTerm) {
    return baseDecorator;
  }

  const existingDecorators = baseDecorator.getDecorators
    ? baseDecorator.getDecorators()
    : baseDecorator._decorators || [];

  return new CompositeDecorator([
    {
      strategy: findSearchTerm(searchTerm),
      component: SearchHighlight,
    },
    ...(Array.isArray(existingDecorators) ? existingDecorators : []),
  ]);
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

const NosachView = (props: Props) => {
  const { subline, markFrom, markTo, showPunctuation, selectedExcerpt, showEditType, searchTerm } = props;

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

      return EditorState.createWithContent(contentState, getDecorator(showEditType, searchTerm));
    },
    [showEditType, searchTerm]
  );

  useEffect(() => {
    let newEditorState;
    if (subline.nosach) {
      let initContent = convertFromRaw(subline.nosach);
      newEditorState = EditorState.createWithContent(initContent, getDecorator(showEditType, searchTerm));
      if (!showPunctuation) {
        newEditorState = memoizedRemovePunctuation(newEditorState);
      }
      const length = newEditorState.getCurrentContent().getPlainText().length;
      if (selectedExcerpt && lineSelected(selectedExcerpt, subline)) {
        newEditorState = mark(newEditorState, 0, length);
      }
    } else {
      newEditorState = EditorState.createWithContent(ContentState.createFromText(''));
    }
    setEditor(newEditorState);
  }, [
    subline,
    markFrom,
    markTo,
    showPunctuation,
    selectedExcerpt,
    showEditType,
    memoizedRemovePunctuation,
    searchTerm,
  ]);

  return <TextEditor selectionFrom={1} selectionTo={4} readOnly={true} initialState={editor} />;
};

export default NosachView;
