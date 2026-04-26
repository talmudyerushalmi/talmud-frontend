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
    RABBI_HIGHLIGHT: {
      textDecoration: 'underline dotted #888',
      textUnderlineOffset: '3px',
    },
    RABBI_SELECTED: {
      fontWeight: 'bold',
      backgroundColor: '#c8e6c9',
      borderRadius: '3px',
      padding: '1px 2px',
    },
    RABBI_ANNOTATION: {
      fontSize: '0.65em',
      color: '#757575',
      verticalAlign: 'sub',
    },
    RABBI_DOUBT: {
      color: '#d32f2f',
      fontWeight: 'bold',
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

