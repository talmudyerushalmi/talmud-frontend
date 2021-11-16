import React, { useEffect, useState } from "react";
import TextEditor from "./TextEditor";
import { IconButton, makeStyles } from "@material-ui/core";
import {  } from "../../../types/types";
import { ContentState, EditorState } from "draft-js";
import { getEditorFromLines, getSublinesFromContent } from "../../../inc/editorUtils";
import { CheckCircle, Close, Edit } from "@material-ui/icons";


interface Props {
  lines: string[],
  onSave: Function;
}

enum MODE {
  EDIT,
  READONLY,
}


const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "1rem",
    position: "relative",
    "& .readonly": {
      backgroundColor: theme.palette.grey[500],
    },
    '& .RichEditor-root': {padding:'5px'}
  },
  buttons: {
    position: "absolute",
    top: '-0.6rem',
  },
}));

const MainLineEditor = (props: Props) => {
  const { lines, onSave } = props;

  const classes = useStyles();

  const [initial, setInitial] = useState(
    EditorState.createWithContent(
      ContentState.createFromText("")
    )
  );
  const [editor, setEditor] = useState(
    EditorState.createWithContent(
      ContentState.createFromText("")
    )
  //const   
  );

  const [mode, setMode] = useState(MODE.READONLY);

  useEffect(() => {
    setEditor(
     getEditorFromLines(lines) 
    );
  }, [lines]);

  const editorChange = (e) => {
    setEditor(e);
  };
  const btnSaveHandler = () => {
    const newLines = getSublinesFromContent(editor)
    setMode(MODE.READONLY); 
    onSave(newLines)
  };
  const btnCancelHandler = () => {
    setEditor(initial);
    setMode(MODE.READONLY);  
  };

  const btnEditHandler = () => {
    setInitial(editor);
    setMode(MODE.EDIT);
  };

  return (
    <>
      <div
        className={`${classes.root} ${
          mode === MODE.READONLY ? "readonly" : ""
        }`}
      >
        <div className={classes.buttons}>
          <IconButton
            size="small"
            onClick={btnEditHandler}
            disabled={mode === MODE.EDIT}
            color="primary"
            aria-label="edit"
          >
            <Edit />
          </IconButton>
          {mode === MODE.EDIT ? (
            <>
              <IconButton
                size="small"
                onClick={btnCancelHandler}
                color="primary"
                aria-label="save"
              >
                <Close />
              </IconButton>
              <IconButton
                size="small"
                onClick={btnSaveHandler}
                color="primary"
                aria-label="save"
              >
                <CheckCircle />
              </IconButton>
            </>
          ) : null}
        </div>
        <TextEditor
          readOnly={mode === MODE.READONLY}
          initialState={editor}
          onChange={editorChange}
        />
      </div>
    </>
  );
};

export default MainLineEditor
