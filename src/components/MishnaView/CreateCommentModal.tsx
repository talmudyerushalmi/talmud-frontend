import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React, { FC, useEffect } from 'react';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createComment, iCommentModal } from '../../store/actions/commentsActions';
import { CommentType } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

interface IProps {
  open: boolean;
  onClose: () => void;
  commentModal: iCommentModal | null;
}

const sx = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    mt: '10px',
  },
};

const CreateCommentModal: FC<IProps> = ({ open, onClose, commentModal }) => {
  const { t } = useTranslation();
  const requiredField = t('Required field');
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.authentication?.username);

  const validationSchema = yup.object({
    text: yup.string().required(requiredField),
    title: yup.string().required(requiredField),
    type: yup.mixed<CommentType>().oneOf([CommentType.PRIVATE, CommentType.MODERATION]).required(requiredField),
    userName: yup.string().optional(),
  });

  const initialValues = {
    text: '',
    title: '',
    userName: '',
    type: CommentType.PRIVATE,
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
    watch,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const typeValue = watch('type');

  const onSubmit = (values: any) => {
    dispatch(
      createComment({
        ...values,
        userName: values?.userName || username,
        fromWord: commentModal?.fromWord ?? '',
        toWord: commentModal?.toWord ?? '',
        lineNumber: commentModal?.lineNumber ?? '',
        lineIndex: commentModal?.lineIndex ?? -1,
      })
    );
    onClose();
  };

  useEffect(() => {
    if (commentModal) {
      reset();
    }
  }, [commentModal, reset]);

  return (
    <Dialog
      fullWidth={true}
      maxWidth="md"
      style={{ direction: 'rtl' }}
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" textAlign="center">
        יצירת הערה
        <Box textAlign="center">
          <Typography component="span">{commentModal?.lineText}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={sx.form}>
          <TextField
            autoFocus
            {...register('title')}
            label={`${t('title')} / ד"ה`}
            type="text"
            required
            fullWidth
            error={touchedFields.title && !!errors.title}
            helperText={touchedFields.title && errors.title?.message}
          />
          <TextField
            {...register('text')}
            label={t('Comment content')}
            type="text"
            fullWidth
            required
            error={touchedFields.text && !!errors.text}
            helperText={touchedFields.text && errors.text?.message}
            rows={4}
            multiline
          />
          <FormControl required>
            <FormLabel id="type">{t('Comment type')}</FormLabel>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <RadioGroup aria-labelledby="type" {...field}>
                  <FormControlLabel value={CommentType.PRIVATE} control={<Radio />} label={t('Personal comment')} />
                  <Box display="flex">
                    <FormControlLabel value={CommentType.MODERATION} control={<Radio />} label={t('Public comment')} />
                    {typeValue === CommentType.MODERATION && (
                      <TextField
                        autoFocus
                        {...register('userName')}
                        label={`${t('Comment Writer Name')}`}
                        type="text"
                        variant="filled"
                        error={touchedFields.userName && !!errors.userName}
                        helperText={touchedFields.userName && errors.userName?.message}
                      />
                    )}
                  </Box>
                  <br />
                </RadioGroup>
              )}
            />
            {typeValue === CommentType.MODERATION && (
              <Typography color="InfoText" fontSize="0.9rem">
                * ההערה תיבדק ותופיע במדור "הערות ציבוריות" אם תאושר. <br /> ניתן להשתמש בהערה ציבורית גם כדי לשלוח
                הודעות תיקון לעורכים.
                <br />
                במידה ולא יוקלד שם, השם שיוצג יהיה השם של המשתמש המחובר לפי חשבון גוגל.
              </Typography>
            )}
          </FormControl>
          <Box mx="auto" display="flex" gap={2}>
            <Button type="submit" variant="contained">
              אישור
            </Button>
            <Button onClick={onClose} variant="contained" color="error">
              ביטול
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommentModal;
