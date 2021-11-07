import React, { useEffect, useState } from "react";
import TextEditor from "./TextEditor";
import { IconButton, makeStyles } from "@material-ui/core";
import { iLine } from "../../../types/types";
import { ContentState, EditorState } from "draft-js";
import { getLineAsText } from "../../../inc/lineUtils";
import { getRawText, getSublinesFromContent } from "../../../inc/editorUtils";
import { CheckCircle, Edit } from "@material-ui/icons";

interface Props {
  line: iLine | null;
}


const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: '3rem',
    position: 'relative'
  },
  buttons: {
    position: 'absolute',
    top: 0
  }
}));


const FieldMainLineEditor2 = (props: Props) => {
  const { line } = props;
  const classes = useStyles();

  const [initial, setInitial] = useState(
    EditorState.createWithContent(
      ContentState.createFromText("textForEditor" || "")
    )
  );

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
  };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.buttons}>
          <IconButton
            onClick={btnSaveHandler}
            color="primary"
            aria-label="save"
          >
            <CheckCircle />
          </IconButton>
          <IconButton color="primary" aria-label="edit">
            <Edit />
          </IconButton>
        </div>
        <TextEditor initialState={initial} onChange={editorChange} />
      </div>
    </>
  );
};

export default FieldMainLineEditor2;
