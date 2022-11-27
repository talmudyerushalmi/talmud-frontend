import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { EditingData } from './MainLineEditor';

export enum NosachEntity {
  ADD = 'ADD',
  DELETE = 'DELETE',
  QUOTE = 'QUOTE',
  CORRECTION = 'CORRECTION',
}
export const NosachMap = new Map([
  [
    NosachEntity.ADD,
    {
      title: 'הוסף',
    },
  ],
  [
    NosachEntity.DELETE,
    {
      title: 'מחק',
    },
  ],
  [
    NosachEntity.QUOTE,
    {
      title: 'ציטוט',
    },
  ],
]);
export interface InitialEntityDialogState {
  type: NosachEntity;
  editingData: EditingData;
}

export interface Props {
  initialState: InitialEntityDialogState;
  open: boolean;
  onSaveEntity: (type: NosachEntity, editingData: EditingData) => void;
  onClose: () => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
}));

export const MainLineDialog = (props: Props) => {
  const classes = useStyles();
  const { onClose, onSaveEntity, open, initialState } = props;
  const { type } = initialState;
  const [editingData, setEditingData] = useState<EditingData>(initialState.editingData);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    setEditingData(initialState.editingData);
  }, [initialState]);

  return (
    <Dialog
      style={{ direction: 'rtl' }}
      BackdropProps={{
        classes: {
          root: classes.root,
        },
      }}
      onClose={handleClose}
      open={open}
    >
      <DialogTitle>{NosachMap.get(initialState.type)?.title}</DialogTitle>
      <DialogContent>
        {type !== NosachEntity.QUOTE ? (
          <TextField
            id="outlined-multiline-flexible"
            label="הערות עריכה"
            multiline
            maxRows={4}
            value={editingData.editingComment}
            onChange={(e) => setEditingData({ ...editingData, editingComment: e.target.value })}
          />
        ) : null}
        {type === NosachEntity.CORRECTION ? (
          <>
            <TextField
              id="outlined-multiline-flexible"
              label="נוסח מקורי"
              multiline
              maxRows={4}
              value={editingData.oldWord}
              onChange={(e) => setEditingData({ ...editingData, oldWord: e.target.value })}
            />
            <TextField
              id="outlined-multiline-flexible"
              label="נוסח מתוקן"
              multiline
              maxRows={4}
              value={editingData.newWord}
              onChange={(e) => setEditingData({ ...editingData, newWord: e.target.value })}
            />
          </>
        ) : null}
        {type === NosachEntity.QUOTE ? (
          <TextField
            id="outlined-multiline-flexible"
            label="הפניה"
            multiline
            maxRows={4}
            value={editingData.linkTo}
            onChange={(e) => setEditingData({ ...editingData, linkTo: e.target.value })}
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            onSaveEntity(initialState.type, { ...editingData });
          }}
        >
          הוסף
        </Button>
        <Button onClick={onClose}>בטל</Button>
      </DialogActions>
    </Dialog>
  );
};

// export default function SimpleDialogDemo() {
//   const [open, setOpen] = React.useState(false);
//   const [selectedValue, setSelectedValue] = React.useState(emails[1]);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = (value: string) => {
//     setOpen(false);
//     setSelectedValue(value);
//   };

//   return (
//     <div>
//       <Typography variant="subtitle1" component="div">
//         Selected: {selectedValue}
//       </Typography>
//       <br />
//       <Button variant="outlined" onClick={handleClickOpen}>
//         Open simple dialog
//       </Button>
//       <SimpleDialog
//         selectedValue={selectedValue}
//         open={open}
//         onClose={handleClose}
//       />
//     </div>
//   );
// }
