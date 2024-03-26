import { Button, LinearProgress, TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import { FC } from 'react';
import { connect } from 'react-redux';
import { iExcerpt } from '../../../types/types';
import { EditorSelectionObject } from '../../../inc/editorUtils';
import { closeExcerptDialog, saveExcerpt } from '../../../store/actions/mishnaEditActions';
import * as Yup from 'yup';

interface IProps {
  saveExcerpt: Function;
  closeExcerptDialog: Function;
  excerpt: iExcerpt;
  selection: EditorSelectionObject;
  mishna: any;
}
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

const commentSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  comment: Yup.string().required('Required'),
});

const FormikCommentExcerpt: FC<IProps> = ({ saveExcerpt, closeExcerptDialog, excerpt, selection, mishna }) => {
  return (
    <Formik
      initialValues={{
        title: excerpt.source?.title || '',
        comment: excerpt.editorStateFullQuote.blocks[0].text || '',
      }}
      validationSchema={commentSchema}
      onSubmit={(values) => {
        const excerptToSave = {
          ...excerpt,
          source: {
            ...excerpt.source,
            title: values.title,
          },
          editorStateFullQuote: {
            ...excerpt.editorStateFullQuote,
            blocks: [{ ...excerpt.editorStateFullQuote.blocks[0], text: values.comment }],
          },
        };
        saveExcerpt(mishna.tractate, mishna.chapter, mishna.mishna, excerptToSave);
      }}>
      {({ submitForm, isSubmitting, values, errors, handleChange }) => {
        return (
          <Form style={{ direction: 'rtl' }}>
            <TextField
              name="title"
              value={values.title}
              onChange={handleChange}
              type="text"
              label="כותרת"
              fullWidth={true}
              required
              error={!!errors.title}
              helperText={!!errors.title && '* ״כותרת״ הוא שדה חובה'}
            />

            <br />
            <br />
            <TextField
              name="comment"
              value={values.comment}
              onChange={handleChange}
              type="text"
              label="תוכן ההערה"
              fullWidth={true}
              multiline
              rows={2}
              required
              error={!!errors.comment}
              helperText={!!errors.comment && '* ״תוכן ההערה״ הוא שדה חובה'}
            />

            <br />
            {isSubmitting && <LinearProgress />}
            <br />
            <Button
              onClick={() => {
                closeExcerptDialog();
              }}>
              בטל
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} onClick={submitForm}>
              {excerpt.key ? 'עדכן' : 'הוסף'}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FormikCommentExcerpt);
