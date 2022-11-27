import React, { useEffect, useState } from 'react';
import { Editor, DefaultDraftBlockRenderMap, EditorState, ContentState, CompositeDecorator, Modifier } from 'draft-js';
import '../text.css';
import { Map } from 'immutable';
import { NumberedBlock } from '../../editors/EditorBlocks';
import { keyBindingArrowsOnly } from '../../editors/EditorKeyBindings';
import { iExcerpt, iMishna } from '../../../types/types';
import { excerptDecorator } from '../../editors/EditorDecorator';
import { getContentFromMishna, getSelectionObject, getSelectionStateFromExcerpt } from '../../../inc/editorUtils';
import { useCallback } from 'react';

const blockRenderMap = Map({
  unstyled: {
    element: 'div',
    wrapper: <NumberedBlock />,
  },
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

const addEntity = (contentState: ContentState, excerpt: iExcerpt) => {
  return contentState.createEntity('EXCERPT', 'MUTABLE', {
    type: excerpt.type,
  });
};

interface Props {
  mishna: iMishna | null;
  onChangeSelection: Function;
}
const TextEditorMishna = (props: Props) => {
  const { mishna, onChangeSelection } = props;
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const getContentWithEntities = useCallback((mishna: iMishna) => {
    let contentState = getContentFromMishna(mishna);
    mishna.excerpts.forEach((excerpt) => {
      contentState = addEntity(contentState, excerpt);
      const entityKey = contentState.getLastCreatedEntityKey();
      const selectionForExcerpt = getSelectionStateFromExcerpt(excerpt, contentState);
      try {
        contentState = Modifier.applyEntity(contentState, selectionForExcerpt, entityKey);
      } catch (e) {
        excerpt.flagNeedUpdate = true;
      }
    });
    let newEditorState = EditorState.createWithContent(contentState, new CompositeDecorator([excerptDecorator]));
    return newEditorState;
  }, []);

  useEffect(() => {
    if (!mishna) {
      return;
    }
    const newEditorState = getContentWithEntities(mishna);
    setEditorState(newEditorState);
  }, [getContentWithEntities, mishna]);

  const _onChange = (editorState) => {
    onChangeSelection(getSelectionObject(editorState));
    setEditorState(editorState);
  };

  return (
    <div className="RichEditor-root">
      <Editor
        keyBindingFn={keyBindingArrowsOnly}
        editorState={editorState}
        blockRenderMap={extendedBlockRenderMap}
        onChange={(editorState) => _onChange(editorState)}
        preserveSelectionOnBlur={true}
        textAlignment="right"
      />
    </div>
  );
};

export default TextEditorMishna;
