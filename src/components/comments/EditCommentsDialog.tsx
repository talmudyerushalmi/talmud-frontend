import React, { FC, useEffect } from 'react';
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
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { CommentType, CommentTypeValues, iComment } from '../../types/types';

interface IProps {
  open: boolean;
  onClose: () => void;
  submitHandler: (values: any) => void;
  comment?: iComment;
}

const sx = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    mt: '10px',
  },
};

const EditCommentsDialog: FC<IProps> = ({ open, onClose, submitHandler, comment }) => {
  const { t } = useTranslation();
  const requiredField = t('Required field');

  const validationSchema = yup.object({
    text: yup.string().required(requiredField),
    title: yup.string().required(requiredField),
    type: yup
      .mixed<CommentTypeValues>()
      .oneOf([CommentTypeValues.PRIVATE, CommentTypeValues.PUBLIC])
      .required(requiredField),
    subline: yup.number().required(requiredField),
  });

  const initialValues = {
    text: comment?.text || 0,
    title: comment?.title || '',
    subline: comment?.subline || '',
    type: comment?.type || '',
  };

  const { errors, handleChange, values, handleSubmit, touched, resetForm, setFieldValue } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);
      submitHandler(values);
    },
  });

  useEffect(() => {
    if (comment) {
      resetForm({
        values: initialValues,
      });
    }
  }, [comment]);

  useEffect(() => {
    console.log('errors', errors);
  }, [errors]);

  return (
    <Dialog
      fullWidth={true}
      maxWidth="md"
      style={{ direction: 'rtl' }}
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" textAlign="center">
        עריכת הערה
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={sx.form}>
          <Box width="100px">
            <TextField
              name="subline"
              label={t('Line number')}
              type="number"
              value={values.subline}
              onChange={(e) => {
                setFieldValue('subline', +e.target.value);
              }}
              error={touched.subline && !!errors.subline}
              helperText={touched.subline && errors.subline}
              size="small"
            />
          </Box>
          <TextField
            autoFocus
            name="title"
            label={t('title')}
            type="text"
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
            value={values.text}
            onChange={handleChange}
            error={touched.text && !!errors.text}
            helperText={touched.text && errors.text}
            rows={4}
            multiline
          />
          <FormControl>
            <FormLabel id="type">{t('Comment type')}</FormLabel>
            <RadioGroup aria-labelledby="type" name="type" value={values.type} onChange={handleChange}>
              <FormControlLabel value={CommentTypeValues.PUBLIC} control={<Radio />} label={t('Public comment')} />
              <FormControlLabel value={CommentTypeValues.PRIVATE} control={<Radio />} label={t('Personal comment')} />
            </RadioGroup>
            {comment?.type === CommentType.MODERATION ? (
              <Typography color="InfoText" fontSize="0.9rem">
                * ההערה נמצאת בבדיקה לפני פרסום ב"הערות ציבוריות"
              </Typography>
            ) : (
              <Typography color="InfoText" fontSize="0.9rem">
                * ההערה תיבדק ותופיע ב"הערות ציבוריות" במידה תאושר
              </Typography>
            )}
          </FormControl>
          <Box mx="auto">
            <Button type="submit" variant="contained">
              אישור
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditCommentsDialog;
