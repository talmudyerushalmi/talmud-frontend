import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, LinearProgress, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import RichTextEditorFieldRHF from '../../editors/RichTextEditorFieldRHF';
import { convertFromRaw, EditorState } from 'draft-js';
import { EditorSelectionObject, getContentRaw } from '../../../inc/editorUtils';
import { connect } from 'react-redux';
import { closeExcerptDialog, saveExcerpt } from '../../../store/actions/mishnaEditActions';
import { EXCERPT_TYPE } from './ExcerptDialog';
import { iExcerpt } from '../../../types/types';

const mapDispatchToProps = (dispatch: any) => ({
  saveExcerpt: (tractate: string, chapter: string, mishna: string, excerpt: any) => {
    dispatch(saveExcerpt(tractate, chapter, mishna, excerpt));
  },
  closeExcerptDialog: () => {
    dispatch(closeExcerptDialog);
  },
});
const mapStateToProps = (state: any) => ({
  isSubmitting: state.mishnaEdit.isSubmitting,
});

interface Props {
  saveExcerpt: Function;
  closeExcerptDialog: Function;
  excerpt: iExcerpt;
  selection: EditorSelectionObject | null;
  mishna: any;
  isSubmitting: boolean;
}

interface FormData {
  key: number | null;
  type: string;
  addingNew: boolean;
  editorStateFullQuote: any;
  sourceLocation: string;
  short: string;
  link: string;
}

const FormNosach = (props: Props) => {
  const { saveExcerpt, closeExcerptDialog, excerpt, selection, mishna, isSubmitting } = props;

  const { control, handleSubmit, register } = useForm<FormData>({
    defaultValues: {
      key: excerpt.key || null,
      type: excerpt?.type || 'NOSACH',
      addingNew: excerpt.key ? false : true,
      editorStateFullQuote: excerpt.key
        ? EditorState.createWithContent(convertFromRaw(excerpt.editorStateFullQuote))
        : EditorState.createEmpty(),
      sourceLocation: selection?.firstWords || '',
      short: excerpt?.short ? excerpt.short : '',
      link: excerpt?.link ? excerpt.link : '',
    },
  });

  const onSubmit = handleSubmit((values: FormData) => {
    const excerptToSave = {
      ...values,
      selection,
      editorStateFullQuote: getContentRaw(values.editorStateFullQuote),
    };
    saveExcerpt(mishna.tractate, mishna.chapter, mishna.mishna, excerptToSave);
  });

  return (
    <form onSubmit={onSubmit} style={{ direction: 'rtl' }}>
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <RadioGroup {...field}>
            <FormControlLabel value={EXCERPT_TYPE.NOSACH} control={<Radio disabled={isSubmitting} />} label="נוסח" />
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
          </RadioGroup>
        )}
      />

      <RichTextEditorFieldRHF name="editorStateFullQuote" control={control} label="הערת נוסח" />

      <TextField
        {...register('short')}
        type="text"
        label="תצוגה קצרה"
        fullWidth={true}
        multiline
        rows={2}
        margin="normal"
      />

      <TextField
        {...register('link')}
        type="url"
        label="קישור"
        fullWidth={true}
        sx={{
          direction: 'rtl',
        }}
        margin="normal"
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

      <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
        {excerpt.key ? 'עדכן' : 'הוסף'}
      </Button>
    </form>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FormNosach);
