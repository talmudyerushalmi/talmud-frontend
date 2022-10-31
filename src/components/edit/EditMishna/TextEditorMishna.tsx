import React, { useEffect, useState } from 'react';
import { Editor, DefaultDraftBlockRenderMap } from 'draft-js';
import '../text.css';
import { Map } from 'immutable';
import { NumberedBlock } from '../../editors/EditorBlocks';
import { keyBindingArrowsOnly } from '../../editors/EditorKeyBindings';

const blockRenderMap = Map({
  unstyled: {
    // element is used during paste or html conversion to auto match your component;
    // it is also retained as part of this.props.children and not stripped out
    element: 'div',
    wrapper: <NumberedBlock />,
  },
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

const TextEditorMishna = (props) => {
  const { onChange, initialState } = props;
  const [editorState, setEditorState] = useState(initialState);

  // needed to update the state when the prop changes
  useEffect(() => {
    setEditorState(initialState);
  }, [initialState]); // add 'value' to the dependency list to recalculate state when value changes.

  const _onChange = (editorState) => {
    onChange(editorState);
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
