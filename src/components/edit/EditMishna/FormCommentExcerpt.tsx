import { Button, LinearProgress, TextField } from '@mui/material';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
  isSubmitting?: boolean;
}

interface FormValues {
  title: string;
  comment: string;
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
  saveExcerpt: (tractate, chapter, mishna, excerpt) => {
    dispatch(saveExcerpt(tractate, chapter, mishna, excerpt));
  },
  closeExcerptDialog: () => {
    dispatch(closeExcerptDialog);
  },
});
const mapStateToProps = (state: any) => ({
  isSubmitting: state.mishnaEdit.isSubmitting,
});

const commentSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  comment: Yup.string().required('Required'),
});

const FormCommentExcerpt: FC<IProps> = ({
  saveExcerpt,
  closeExcerptDialog,
  excerpt,
  selection,
  mishna,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: excerpt.source?.title || '',
      comment: excerpt.editorStateFullQuote.blocks[0].text || '',
    },
    resolver: yupResolver(commentSchema),
  });

  const onSubmit = (values: FormValues) => {
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
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ direction: 'rtl' }}>
      <TextField
        {...register('title')}
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
        {...register('comment')}
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
      <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
        {excerpt.key ? 'עדכן' : 'הוסף'}
      </Button>
    </form>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FormCommentExcerpt);
