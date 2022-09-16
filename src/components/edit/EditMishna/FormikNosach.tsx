import * as React from "react";
import { Formik, Form, Field } from "formik";
import {
  Button,
  LinearProgress,
  FormControlLabel,
  Radio,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import RichTextEditorField from "../../editors/RichTextEditorField";
import { RadioGroup, TextField } from "formik-material-ui";
import { convertFromRaw, EditorState } from "draft-js";
import { getContentRaw } from "../../../inc/editorUtils";
import * as Yup from "yup";
import { connect } from "react-redux";
import {
  closeExcerptDialog,
  saveExcerpt,
} from "../../../store/actions/mishnaEditActions";
import { EXCERPT_TYPE } from "./ExcerptDialog";

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
        type: excerpt?.type || "NOSACH",
        addingNew: excerpt.key ? false : true,
        editorStateFullQuote: excerpt.key
          ? EditorState.createWithContent(
              convertFromRaw(excerpt.editorStateFullQuote)
            )
          : EditorState.createEmpty(),
       sourceLocation: selection.firstWords,
       link:  excerpt?.link ? excerpt.link : ''
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
            <Field component={RadioGroup} name="type">
              <FormControlLabel
                value={EXCERPT_TYPE.NOSACH}
                control={<Radio disabled={isSubmitting} />}
                label="נוסח"
              />
              <FormControlLabel
                value={EXCERPT_TYPE.BIBLIO}
                control={<Radio disabled={isSubmitting} />}
                label="ביבליוגרפיה"
                disabled={isSubmitting}
              />
                <FormControlLabel
                value={EXCERPT_TYPE.EXPLANATORY}
                control={<Radio disabled={isSubmitting} />}
                label="פרשנית"
                disabled={isSubmitting}
              />
               <FormControlLabel
                value={EXCERPT_TYPE.DICTIONARY}
                control={<Radio disabled={isSubmitting} />}
                label="מילון"
                disabled={isSubmitting}
              />
            </Field>
            <RichTextEditorField
              name="editorStateFullQuote"
              label="הערת נוסח"
            />
            <Field
              component={TextField}
              name="link"
              type="url"
              label="קישור"
              fullWidth={true}
              sx={{
                direction:'rtl',
              }}
            />
            <br />

            {isSubmitting && <LinearProgress />}
            <br />
            <Button
              onClick={() => {
                closeExcerptDialog();
              }}
            >
              בטל
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              onClick={submitForm}
            >
              {excerpt.key ? "עדכן" : "הוסף"}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FormikWrapper);
