import React, { useEffect, useState } from "react";
import TextEditor from "./TextEditor";
import { IconButton, makeStyles } from "@material-ui/core";
import { iLine } from "../../../types/types";
import { ContentState, EditorState } from "draft-js";
import { getLineAsText } from "../../../inc/lineUtils";
import { getRawText, getSublinesFromContent } from "../../../inc/editorUtils";
import { CheckCircle, Close, Edit } from "@material-ui/icons";
import { connect } from "react-redux";
import { saveNosach } from "../../../store/actions/mishnaEditActions";
import { useParams } from "react-router";
import { routeObject } from "../../../routes/AdminRoutes";

interface Props {
  lineData: iLine | null;
  saveNosach: Function;
}

enum MODE {
  EDIT,
  READONLY,
}

const mapStateToProps = (state) => ({
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  saveNosach: async (route: routeObject, newSublines: string[])=>{
   dispatch(saveNosach(route, newSublines))
  }

});

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
  const { lineData, saveNosach } = props;
  const route = useParams<routeObject>();

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
        ContentState.createFromText(getLineAsText(lineData))
      )
    );
  }, [lineData]);

  const editorChange = (e) => {
    setInitial(e);
  };
  const btnSaveHandler = () => {
    console.log(getRawText(initial));
    console.log(getSublinesFromContent(initial));
    const newSublines = getSublinesFromContent(initial)
    setMode(MODE.READONLY);    console.log(lineData)

    saveNosach(route, newSublines)

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
            disabled={mode === MODE.EDIT}
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

export default connect(mapStateToProps, mapDispatchToProps)(FieldMainLineEditor2);
