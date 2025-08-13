import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import { DialogContent, FormGroup, MenuItem, Button, IconButton, TextField, Select } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { CompositionType } from '../../../types/types';
import SettingsService from '../../../services/settingsServince';

export interface CompositionDialogProps {
  open: boolean;
  onClose: (value?: string) => void;
  onAdd: Function;
}

interface FormValues {
  title: string;
  secondary_title: string;
  type: CompositionType;
  date: string;
  region: string;
  author: string;
  edition: string;
}

const CompositionDialog = (props: CompositionDialogProps) => {
  const { onClose, onAdd, open } = props;

  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      title: '',
      secondary_title: '',
      type: CompositionType.EXCERPT,
      date: '',
      region: '',
      author: '',
      edition: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    SettingsService.addSource({ ...values }).then((res) => {
      onAdd();
      onClose();
    });
  };

  return (
    <Dialog style={{ direction: 'rtl' }} open={open}>
      <DialogTitle>הוסף חיבור</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup sx={{ margin: '1rem 0' }}>
            <TextField {...register('title')} type="text" label="שם חיבור" />
          </FormGroup>
          <FormGroup sx={{ margin: '1rem 0' }}>
            <TextField {...register('secondary_title')} type="text" label="שם משני" />
          </FormGroup>
          <FormGroup sx={{ margin: '1rem 0' }}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select {...field} label="סוג">
                  <MenuItem value={CompositionType.PARALLEL}>מקבילה</MenuItem>
                  <MenuItem value={CompositionType.EXCERPT}>מובאה</MenuItem>
                  <MenuItem value={CompositionType.YALKUT}>ילקוט</MenuItem>
                </Select>
              )}
            />
          </FormGroup>

          <FormGroup sx={{ margin: '1rem 0' }}>
            <TextField {...register('date')} type="text" label="תאריך החיבור" />
          </FormGroup>
          <FormGroup sx={{ margin: '1rem 0' }}>
            <TextField {...register('region')} type="text" label="אזור החיבור" />
          </FormGroup>
          <FormGroup sx={{ margin: '1rem 0' }}>
            <TextField {...register('author')} type="text" label="מחבר" />
          </FormGroup>
          <FormGroup sx={{ margin: '1rem 0' }}>
            <TextField {...register('edition')} type="text" label="מהדורה" />
          </FormGroup>
          <Button type="submit">הוסף</Button>
          <Button
            onClick={() => {
              onClose();
            }}>
            בטל
          </Button>
        </form>
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
