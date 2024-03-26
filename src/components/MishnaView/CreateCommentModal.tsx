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
import { useFormik } from 'formik';
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
  const username = useAppSelector((state) => state.authentication.username);

  const validationSchema = yup.object({
    text: yup.string().required(requiredField),
    title: yup.string().required(requiredField),
    type: yup.mixed<CommentType>().oneOf([CommentType.PRIVATE, CommentType.MODERATION]).required(requiredField),
  });

  const initialValues = {
    text: '',
    title: '',
    userName: '',
    type: CommentType.PRIVATE,
  };

  const { errors, handleChange, values, handleSubmit, touched, resetForm } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
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
    },
  });

  useEffect(() => {
    if (commentModal) {
      resetForm();
    }
  }, [commentModal, resetForm]);

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
        <Box component="form" onSubmit={handleSubmit} sx={sx.form}>
          <TextField
            autoFocus
            name="title"
            label={`${t('title')} / ד"ה`}
            type="text"
            required
            fullWidth
            value={values.title}
            onChange={handleChange}
            error={touched.title && !!errors.title}
            helperText={touched.text && errors.title}
          />
          <TextField
            name="text"
            label={t('Comment content')}
            type="text"
            fullWidth
            required
            value={values.text}
            onChange={handleChange}
            error={touched.text && !!errors.text}
            helperText={touched.text && errors.text}
            rows={4}
            multiline
          />
          <FormControl required>
            <FormLabel id="type">{t('Comment type')}</FormLabel>
            <RadioGroup aria-labelledby="type" name="type" value={values.type} onChange={handleChange}>
              <FormControlLabel value={CommentType.PRIVATE} control={<Radio />} label={t('Personal comment')} />
              <Box display="flex">
                <FormControlLabel value={CommentType.MODERATION} control={<Radio />} label={t('Public comment')} />
                {values.type === CommentType.MODERATION && (
                  <TextField
                    autoFocus
                    name="userName"
                    label={`${t('Comment Writer Name')}`}
                    type="text"
                    variant="filled"
                    value={values.userName}
                    onChange={handleChange}
                    error={touched.userName && !!errors.userName}
                    helperText={touched.text && errors.userName}
                  />
                )}
              </Box>
              <br />
            </RadioGroup>
            {values?.type === CommentType.MODERATION && (
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
