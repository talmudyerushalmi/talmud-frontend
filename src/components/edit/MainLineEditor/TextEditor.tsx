import React, { useEffect, useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import '../text.css';
import { useTheme } from '@mui/material';

interface Props {
  selectionFrom?: number;
  selectionTo?: number;
  readOnly?: boolean;
  initialState: EditorState;
  onChange?: Function;
}


const TextEditor = (props: Props) => {
  const { onChange, initialState, readOnly } = props;
  const [editorState, setEditorState] = useState(initialState);
  const t = useTheme();

  const styleMap = {
    STRIKETHROUGH: {
      textDecoration: 'line-through',
      color: 'red',
    },
    MARK: {
      ...t.editor.excerpt
    },
  };

  // needed to update the state when the prop changes
  useEffect(() => {
    setEditorState(initialState);
  }, [initialState]); // add 'value' to the dependency list to recalculate state when value changes.

  const _onChange = (editorState) => {
    if (onChange) {
      onChange(editorState);
    }
    setEditorState(editorState);
  };

  return (
    <div
      style={{
        ...(readOnly
          ? {
              ...t.editor.default,
            }
          : {
              ...t.editor.inEdit,
            }),
        width: '100%',
        border: 'none',
        padding: 0,
      }}
      className="RichEditor-root">
      <Editor
        customStyleMap={styleMap}
        readOnly={readOnly}
        editorState={editorState}
        onChange={(editorState) => _onChange(editorState)}
        preserveSelectionOnBlur={true}
        textAlignment="right"
      />
    </div>
  );
};

export default TextEditor;

