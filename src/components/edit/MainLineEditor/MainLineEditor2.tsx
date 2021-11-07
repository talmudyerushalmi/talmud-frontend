import React, { useEffect, useState } from "react";
import TextEditor from "./TextEditor";
import { IconButton, makeStyles } from "@material-ui/core";
import { iLine } from "../../../types/types";
import { ContentState, EditorState } from "draft-js";
import { getLineAsText } from "../../../inc/lineUtils";
import { getRawText, getSublinesFromContent } from "../../../inc/editorUtils";
import { CheckCircle, Close, Edit } from "@material-ui/icons";

interface Props {
  line: iLine | null;
}

enum MODE {
  EDIT,
  READONLY,
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "3rem",
    position: "relative",
    "& .readonly": {
      backgroundColor: theme.palette.grey[500],
    },
  },
  buttons: {
    position: "absolute",
    top: 0,
  },
}));

const FieldMainLineEditor2 = (props: Props) => {
  const { line } = props;
  const classes = useStyles();

  const [initial, setInitial] = useState(
    EditorState.createWithContent(
      ContentState.createFromText("textForEditor" || "")
    )
  );


  const [mode, setMode] = useState(MODE.READONLY);

  useEffect(() => {
    setInitial(
      EditorState.createWithContent(
        ContentState.createFromText(getLineAsText(line))
      )
    );
  }, [line]);

  const editorChange = (e) => {
    setInitial(e);
  };
  const btnSaveHandler = () => {
    console.log(getRawText(initial));
    console.log(getSublinesFromContent(initial));
    setMode(MODE.READONLY);
  };

  const btnEditHandler = () => {
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
            onClick={btnEditHandler}
            color="primary"
            aria-label="edit"
          >
            <Edit />
          </IconButton>
          {mode === MODE.EDIT ? (
            <>
              <IconButton
                onClick={btnSaveHandler}
                color="primary"
                aria-label="save"
              >
                <Close />
              </IconButton>
              <IconButton
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
          initialState={initial}
          onChange={editorChange}
        />
      </div>
    </>
  );
};

export default FieldMainLineEditor2;
