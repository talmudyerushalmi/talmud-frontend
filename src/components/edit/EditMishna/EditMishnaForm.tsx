import * as React from "react";
import { Formik, Form } from "formik";
import {
  Button,
  LinearProgress,
  TextField as TextFieldOriginal,
  makeStyles,
} from "@material-ui/core";
import RichTextEditorField from "../../editors/RichTextEditorField";
import { convertToRaw } from "draft-js";
import * as Yup from "yup";
import { connect } from "react-redux";
import { saveMishna } from "../../../store/actions/mishnaEditActions";
import { useParams } from "react-router";
import { routeObject } from "../../../routes/AdminRoutes";
import { getContentOrEmpty } from "../../../inc/editorUtils";


const mapDispatchToProps = (dispatch, ownProps) => ({
    saveMishna: (route, saveMishnaDTO) => {
        dispatch(saveMishna(route, saveMishnaDTO))}

});
const mapStateToProps = (state) => ({
  isSubmitting: state.mishnaEdit.isSubmitting,
  currentMishna: state.general.currentMishna
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
const excerptSchema = Yup.object().shape({
 // source: Yup.object().required("Required"),
});

const FormikWrapper = (props) => {
  const route = useParams<routeObject>();  
  const classes = useStyles();
  const {
    closeExcerptDialog,
    excerpt,
    mishna,
    currentMishna,
    saveMishna,
    isSubmitting
  } = props;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{

        richTextMishna: getContentOrEmpty(currentMishna?.richTextMishna),
        richTextTosefta: getContentOrEmpty(currentMishna?.richTextTosefta),
        richTextBavli: getContentOrEmpty(currentMishna?.richTextBavli)
        
      }}
      validationSchema={excerptSchema}
      onSubmit={(values, props) => {
        const save = {
          ...values,
          richTextMishna: convertToRaw(values.richTextMishna.getCurrentContent()),
          richTextTosefta: convertToRaw(values.richTextTosefta.getCurrentContent()),
          richTextBavli: convertToRaw(values.richTextBavli.getCurrentContent())
        };
        saveMishna(route, save);

      }}
    >
      {({ submitForm, setFieldValue, values, errors }) => {

        return (
          <Form style={{ direction: "rtl", width: "100%" }}>
            <RichTextEditorField name="richTextMishna" label="משנה" />
            <RichTextEditorField name="richTextTosefta" label="תוספתא" />
            <RichTextEditorField name="richTextBavli" label="בבלי" />
            {isSubmitting && <LinearProgress />}
            <br />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              שמור
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FormikWrapper);
