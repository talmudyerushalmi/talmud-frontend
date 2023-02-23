import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, LinearProgress, FormControlLabel, Radio, TextField as TextFieldOriginal } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { TextField, CheckboxWithLabel, RadioGroup, Autocomplete } from 'formik-mui';
import RichTextEditorField from '../../editors/RichTextEditorField';
import { convertFromRaw, EditorState } from 'draft-js';
import { getContentRaw } from '../../../inc/editorUtils';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { closeExcerptDialog, saveExcerpt } from '../../../store/actions/mishnaEditActions';
import AddComposition from '../addComposition/AddComposition';
import { Box } from '@mui/system';
import { CompositionType } from '../../../types/types';
import { requestCompositions } from '../../../store/actions';

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveExcerpt: (tractate, chapter, mishna, excerpt) => {
    dispatch(saveExcerpt(tractate, chapter, mishna, excerpt));
  },
  closeExcerptDialog: () => {
    dispatch(closeExcerptDialog);
  },
  requestCompositions: () => {
    dispatch(requestCompositions());
  },
});
const mapStateToProps = (state) => ({
  isSubmitting: state.mishnaEdit.isSubmitting,
});

const useStyles = makeStyles({
  // need to specifiy direction for flex -
  // wanted direction is rtl but RTL function switches it to ltr, so we put ltr..
  option: {
    direction: 'rtl',
  },
  root: {
    marginBottom: '0.5rem',
  },
});
const excerptSchema = Yup.object().shape({
  source: Yup.object().required('Required'),
});

const FormikWrapper = (props) => {
  const classes = useStyles();
  const { saveExcerpt, closeExcerptDialog, excerpt, selection, mishna, compositions, requestCompositions } = props;

  return (
    <Formik
      initialValues={{
        key: excerpt.key ? excerpt.key : null,
        addingNew: excerpt.key ? false : true,
        type: excerpt?.type || 'MUVAA',
        seeReference: excerpt.key ? excerpt.seeReference : false,
        source: excerpt.key ? excerpt.source : null,
        sourceLocation: excerpt.key ? excerpt.sourceLocation : '',
        editorStateFullQuote: excerpt.key
          ? EditorState.createWithContent(convertFromRaw(excerpt.editorStateFullQuote))
          : EditorState.createEmpty(),
        short: excerpt?.short ? excerpt.short : '',
        synopsis: excerpt.key ? excerpt.synopsis : '',
        editorStateComments: excerpt.key
          ? EditorState.createWithContent(convertFromRaw(excerpt.editorStateComments))
          : EditorState.createEmpty(),
        link: excerpt?.link ? excerpt.link : '',
      }}
      validationSchema={excerptSchema}
      onSubmit={(values, props) => {
        const excerptToSave = {
          ...values,
          selection,
          editorStateFullQuote: getContentRaw(values.editorStateFullQuote),
          editorStateComments: getContentRaw(values.editorStateComments),
        };
        saveExcerpt(mishna.tractate, mishna.chapter, mishna.mishna, excerptToSave);
      }}>
      {({ submitForm, setFieldValue, isSubmitting, values, errors }) => {
        const allowedTypes =
          values?.type === 'MUVAA' ? [CompositionType.YALKUT, CompositionType.EXCERPT] : [CompositionType.PARALLEL];
        const filteredCompositions = compositions.filter((f) => {
          return allowedTypes.some((allowed) => allowed === f.type);
        });

        return (
          <Form style={{ direction: 'rtl' }}>
            <Field component={RadioGroup} name="type">
              <FormControlLabel value="MUVAA" control={<Radio disabled={isSubmitting} />} label="מובאה" />
              <FormControlLabel
                value="MAKBILA"
                control={<Radio disabled={isSubmitting} />}
                label="מקבילה"
                disabled={isSubmitting}
              />
            </Field>
            <Field component={CheckboxWithLabel} type="checkbox" name="seeReference" Label={{ label: 'ראו' }} />

            <Box display="flex">
              <Field
                name="source"
                component={Autocomplete}
                classes={classes}
                options={filteredCompositions}
                noOptionsText="אין אפשרויות"
                getOptionLabel={(option) => {
                  return option.title || '';
                }}
                style={{ width: 300 }}
                renderInput={(params) => <TextFieldOriginal {...params} label="שם החיבור" variant="outlined" />}
              />
              <AddComposition onAdd={requestCompositions} />
            </Box>
            <Field component={TextField} name="sourceLocation" type="text" label="מיקום בחיבור" />
            <RichTextEditorField name="editorStateFullQuote" label="ציטוט מלא" />
            <Field
              component={TextField}
              name="short"
              type="text"
              label="תצוגה קצרה"
              fullWidth={true}
              multiline
              rows={2}
            />
            <Field
              style={{ width: '100%' }}
              component={TextField}
              name="synopsis"
              type="text"
              label="סינופסיס"
              InputProps={{ multiline: true, fullWidth: true }}
            />
            <RichTextEditorField name="editorStateComments" label="הערות" />
            <Field
              component={TextField}
              name="link"
              type="url"
              label="קישור"
              fullWidth={true}
              sx={{
                direction: 'rtl',
              }}
            />
            <br />

            {isSubmitting && <LinearProgress />}
            <br />
            {errors.source ? <p>יש להזין מקור</p> : null}

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

export default connect(mapStateToProps, mapDispatchToProps)(FormikWrapper);
