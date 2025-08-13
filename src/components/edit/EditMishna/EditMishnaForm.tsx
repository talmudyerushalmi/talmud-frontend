import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button, LinearProgress } from '@mui/material';
import RichTextEditorFieldRHF from '../../editors/RichTextEditorFieldRHF';
import { convertToRaw } from 'draft-js';
import { connect } from 'react-redux';
import { saveMishna } from '../../../store/actions/mishnaEditActions';
import { useParams } from 'react-router';
import { routeObject } from '../../../store/reducers/navigationReducer';
import { getContentOrEmpty } from '../../../inc/editorUtils';

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
  saveMishna: (route: any, saveMishnaDTO: any) => {
    dispatch(saveMishna(route, saveMishnaDTO));
  },
});
const mapStateToProps = (state: any) => ({
  isSubmitting: state.mishnaEdit.isSubmitting,
  currentMishna: state.navigation.currentMishna,
});

interface FormValues {
  richTextMishna: any;
  richTextTosefta: any;
  richTextBavli: any;
}

const FormikWrapper = (props: any) => {
  const route = useParams<routeObject>();
  const { currentMishna, saveMishna, isSubmitting } = props;

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      richTextMishna: getContentOrEmpty(currentMishna?.richTextMishna),
      richTextTosefta: getContentOrEmpty(currentMishna?.richTextTosefta),
      richTextBavli: getContentOrEmpty(currentMishna?.richTextBavli),
    },
  });

  const onSubmit = (values: FormValues) => {
    const save = {
      ...values,
      richTextMishna: convertToRaw(values.richTextMishna.getCurrentContent()),
      richTextTosefta: convertToRaw(values.richTextTosefta.getCurrentContent()),
      richTextBavli: convertToRaw(values.richTextBavli.getCurrentContent()),
    };
    saveMishna(route, save);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ direction: 'rtl', width: '100%' }}>
      <RichTextEditorFieldRHF name="richTextMishna" control={control} label="משנה" />
      <RichTextEditorFieldRHF name="richTextTosefta" control={control} label="תוספתא" />
      <RichTextEditorFieldRHF name="richTextBavli" control={control} label="בבלי" />
      {isSubmitting && <LinearProgress />}
      <br />
      <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
        שמור
      </Button>
    </form>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FormikWrapper);
