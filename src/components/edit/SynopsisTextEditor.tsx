import React, { useEffect, useState } from 'react';
import {
  Editor,
  EditorState,
  ContentState,
  convertFromRaw,
  convertToRaw,
  DraftHandleValue,
} from 'draft-js';
import './text.css';
import { EditedText, iSynopsis } from '../../types/types';
import { getTextForSynopsis } from '../../inc/synopsisUtils';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& .RichEditor-root': { width: '100%' },
  },
}));

const calculateEditorState = (value: EditedText, source: iSynopsis): EditorState => {
  if (value.content) {
    const content = convertFromRaw(value.content);
    return EditorState.createWithContent(content);
  }
  if (value.simpleText) {
    return EditorState.createWithContent(ContentState.createFromText(value.simpleText));
  }
  return EditorState.createEmpty();
};

interface Props {
  onChange: Function;
  value: EditedText;
  source: iSynopsis;
}
const SynopsisTextEditor = (props: Props) => {
  const classes = useStyles();
  const { onChange, value, source } = props;

  // return (
  //   <pre>{JSON.stringify(value)}</pre>
  // )
  const [editorState, setEditorState] = useState(calculateEditorState(value, source));

  useEffect(() => {
    setEditorState(calculateEditorState(value, source));
  }, [source, value]);

  const _onChange = (editorState) => {
    setEditorState(editorState);
  };
  const collectSublineDetails = (editorState: EditorState) => {
    const text = editorState.getCurrentContent().getPlainText();

    return {
      simpleText: text,
      content: convertToRaw(editorState.getCurrentContent()),
    };
  };

  const handlePastedText = (text: string): DraftHandleValue => {
    const strippedText = getTextForSynopsis(text, source);
    const newState = EditorState.createWithContent(ContentState.createFromText(strippedText));
    onChange(collectSublineDetails(newState));
    return 'handled';
  };

  return (
    <div className={classes.root}>
      <div className="RichEditor-root">
        <Editor
          handlePastedText={handlePastedText}
          customStyleMap={colorStyleMap}
          editorState={editorState}
          onChange={(editorState) => _onChange(editorState)}
          onBlur={() => {
            onChange(collectSublineDetails(editorState));
          }}
          //   onFocus={e => moveSelectionToEnd()}
          preserveSelectionOnBlur={true}
          textAlignment="right"
        />
      </div>
    </div>
  );
};

export default SynopsisTextEditor;

const colorStyleMap = {
  red: {
    color: 'rgba(255, 0, 0, 1.0)',
  },
  orange: {
    color: 'rgba(255, 127, 0, 1.0)',
  },
  yellow: {
    color: 'rgba(180, 180, 0, 1.0)',
  },
  green: {
    color: 'rgba(0, 180, 0, 1.0)',
  },
  blue: {
    color: 'rgba(0, 0, 255, 1.0)',
  },
  indigo: {
    color: 'rgba(75, 0, 130, 1.0)',
  },
  violet: {
    color: 'rgba(127, 0, 255, 1.0)',
  },
};

