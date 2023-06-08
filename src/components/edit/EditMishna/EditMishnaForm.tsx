import * as React from 'react';
import { Formik, Form } from 'formik';
import { Button, LinearProgress } from '@mui/material';
import RichTextEditorField from '../../editors/RichTextEditorField';
import { convertToRaw } from 'draft-js';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { saveMishna } from '../../../store/actions/mishnaEditActions';
import { useParams } from 'react-router';
import { routeObject } from '../../../store/reducers/navigationReducer';
import { getContentOrEmpty } from '../../../inc/editorUtils';

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveMishna: (route, saveMishnaDTO) => {
    dispatch(saveMishna(route, saveMishnaDTO));
  },
});
const mapStateToProps = (state) => ({
  isSubmitting: state.mishnaEdit.isSubmitting,
  currentMishna: state.navigation.currentMishna,
});


const excerptSchema = Yup.object().shape({
  // source: Yup.object().required("Required"),
});

const FormikWrapper = (props) => {
  const route = useParams<routeObject>();
  const { currentMishna, saveMishna, isSubmitting } = props;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        richTextMishna: getContentOrEmpty(currentMishna?.richTextMishna),
        richTextTosefta: getContentOrEmpty(currentMishna?.richTextTosefta),
        richTextBavli: getContentOrEmpty(currentMishna?.richTextBavli),
      }}
      validationSchema={excerptSchema}
      onSubmit={(values, props) => {
        const save = {
          ...values,
          richTextMishna: convertToRaw(values.richTextMishna.getCurrentContent()),
          richTextTosefta: convertToRaw(values.richTextTosefta.getCurrentContent()),
          richTextBavli: convertToRaw(values.richTextBavli.getCurrentContent()),
        };
        saveMishna(route, save);
      }}
    >
      {({ submitForm, setFieldValue, values, errors }) => {
        return (
          <Form style={{ direction: 'rtl', width: '100%' }}>
            <RichTextEditorField name="richTextMishna" label="משנה" />
            <RichTextEditorField name="richTextTosefta" label="תוספתא" />
            <RichTextEditorField name="richTextBavli" label="בבלי" />
            {isSubmitting && <LinearProgress />}
            <br />
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              שמור
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FormikWrapper);
