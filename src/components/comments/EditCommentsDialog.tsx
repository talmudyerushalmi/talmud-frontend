import React, { FC, useEffect, useMemo } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { iComment } from '../../types/types';

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
  });

  const initialValues = useMemo(
    () => ({
      text: comment?.text || '',
      title: comment?.title || '',
    }),
    [comment]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  const onSubmit = (values: any) => {
    console.log(values);
    submitHandler(values);
  };

  useEffect(() => {
    if (comment) {
      reset(initialValues);
    }
  }, [comment, initialValues, reset]);

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
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={sx.form}>
          <TextField
            autoFocus
            {...register('title')}
            label={t('title')}
            type="text"
            fullWidth
            error={touchedFields.title && !!errors.title}
            helperText={touchedFields.title && errors.title?.message}
          />
          <TextField
            {...register('text')}
            label={t('Comment content')}
            type="text"
            fullWidth
            error={touchedFields.text && !!errors.text}
            helperText={touchedFields.text && errors.text?.message}
            rows={4}
            multiline
          />
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
