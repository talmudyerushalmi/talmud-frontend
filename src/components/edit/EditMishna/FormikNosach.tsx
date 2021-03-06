import * as React from "react";
import { Formik, Form } from "formik";
import {
  Button,
  LinearProgress,
  TextField as TextFieldOriginal,
  makeStyles,
} from "@material-ui/core";
import RichTextEditorField from "../../editors/RichTextEditorField";
import { convertFromRaw, EditorState } from "draft-js";
import { getContentRaw } from "../../../inc/editorUtils";
import * as Yup from "yup";
import { connect } from "react-redux";
import {
  closeExcerptDialog,
  saveExcerpt,
} from "../../../store/actions/mishnaEditActions";

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveExcerpt: (tractate, chapter, mishna, excerpt) => {
    dispatch(saveExcerpt(tractate, chapter, mishna, excerpt));
  },
  closeExcerptDialog: () => {
    dispatch(closeExcerptDialog);
  },
});
const mapStateToProps = (state) => ({
  isSubmitting: state.mishnaEdit.isSubmitting,
});

const useStyles = makeStyles({
  // need to specifiy direction for flex -
  // wanted direction is rtl but RTL function switches it to ltr, so we put ltr..
  option: {
    direction: "ltr",
  },
  root: {
    marginBottom: "0.5rem",
  },
});

const FormikWrapper = (props) => {
  const classes = useStyles();
  const {
    saveExcerpt,
    closeExcerptDialog,
    excerpt,
    selection,
    mishna,
  } = props;

  return (
    <Formik
      initialValues={{
        key: excerpt.key ? excerpt.key : null,
        type: "NOSACH",
        addingNew: excerpt.key ? false : true,
        editorStateFullQuote: excerpt.key
          ? EditorState.createWithContent(
              convertFromRaw(excerpt.editorStateFullQuote)
            )
          : EditorState.createEmpty(),
       sourceLocation: selection.firstWords   
      
      }}
      onSubmit={(values, props) => {
        const excerptToSave = {
          ...values,
          selection,
          editorStateFullQuote: getContentRaw(values.editorStateFullQuote),
        };
        saveExcerpt(
          mishna.tractate,
          mishna.chapter,
          mishna.mishna,
          excerptToSave
        );
      }}
    >
      {({ submitForm, setFieldValue, isSubmitting, values, errors }) => {

        return (
          <Form style={{ direction: "rtl" }}>
            <RichTextEditorField
              name="editorStateFullQuote"
              label="???????? ????????"
            />
            <br />

            {isSubmitting && <LinearProgress />}
            <br />
            <Button
              onClick={() => {
                closeExcerptDialog();
              }}
            >
              ??????
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              onClick={submitForm}
            >
              {excerpt.key ? "????????" : "????????"}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FormikWrapper);
