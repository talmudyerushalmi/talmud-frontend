import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import { DialogContent, FormGroup, MenuItem, Button, IconButton } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField, Select } from 'formik-mui';
import { CompositionType } from '../../../types/types';
import SettingsService from '../../../services/settingsServince';

export interface CompositionDialogProps {
  open: boolean;
  onClose: (value?: string) => void;
  onAdd: Function;
}

const CompositionDialog = (props: CompositionDialogProps) => {
  const { onClose, onAdd, open } = props;

  return (
    <Dialog style={{ direction: 'rtl' }} open={open}>
      <DialogTitle>הוסף חיבור</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            title: '',
            secondary_title: '',
            type: CompositionType.EXCERPT,
            date: '',
            region: '',
            author: '',
            edition: '',
          }}
          onSubmit={(values, actions) => {
            SettingsService.addSource({ ...values }).then((res) => {
              onAdd();
              onClose();
            });
          }}>
          <Form>
            <FormGroup sx={{ margin: '1rem 0' }}>
              <Field component={TextField} type="text" name="title" label="שם חיבור" />
            </FormGroup>
            <FormGroup sx={{ margin: '1rem 0' }}>
              <Field component={TextField} type="text" name="secondary_title" label="שם משני" />
            </FormGroup>
            <FormGroup sx={{ margin: '1rem 0' }}>
              <Field component={Select} name="type" label="סוג">
                <MenuItem value={CompositionType.PARALLEL}>מקבילה</MenuItem>
                <MenuItem value={CompositionType.EXCERPT}>מובאה</MenuItem>
                <MenuItem value={CompositionType.YALKUT}>ילקוט</MenuItem>
              </Field>
            </FormGroup>

            <FormGroup sx={{ margin: '1rem 0' }}>
              <Field component={TextField} type="text" name="date" label="תאריך החיבור" />
            </FormGroup>
            <FormGroup sx={{ margin: '1rem 0' }}>
              <Field component={TextField} type="text" name="region" label="אזור החיבור" />
            </FormGroup>
            <FormGroup sx={{ margin: '1rem 0' }}>
              <Field component={TextField} type="text" name="author" label="מחבר" />
            </FormGroup>
            <FormGroup sx={{ margin: '1rem 0' }}>
              <Field component={TextField} type="text" name="edition" label="מהדורה" />
            </FormGroup>
            <Button type="submit">הוסף</Button>
            <Button
              onClick={() => {
                onClose();
              }}>
              בטל
            </Button>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

interface Props {
  onAdd: Function;
}
export default function AddComposition(props: Props) {
  const { onAdd } = props;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value?: string) => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <AddIcon />
      </IconButton>
      <CompositionDialog open={open} onClose={handleClose} onAdd={onAdd}/>
    </div>
  );
}
