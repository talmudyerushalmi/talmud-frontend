import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export enum NosachEntity  {
  ADD = 'ADD',
  DELETE = 'DELETE',
  QUOTE = 'QUOTE'
}
export const NosachMap = new Map([
  [
    NosachEntity.ADD,
    {
      title: "הוסף",
    },
  ],
  [
    NosachEntity.DELETE,
    {
      title: "מחק",
    },
  ],
  [
    NosachEntity.QUOTE,
    {
      title: "ציטוט",
    },
  ],
  

]);
export interface InitialEntityDialogState{
  type: NosachEntity,
  editingComment: string;
}


export interface Props {
  initialState: InitialEntityDialogState;
  open: boolean;
  onSaveEntity: (e)=>void;
  onClose: () => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)'

  },

}));

export const MainLineDialog = (props: Props)=>{
  const classes = useStyles();
  const { onClose, onSaveEntity, open, initialState } = props;
  const [editingComment, setEditingComment] = useState(initialState.editingComment)

  const handleClose = () => {
    onClose();
  };


  useEffect(()=>{
    setEditingComment(initialState.editingComment)
  },[initialState])

  return (
    <Dialog 
    style={{direction:'rtl'}}
    BackdropProps= {{
      classes: {
          root: classes.root
      }}}
    onClose={handleClose} open={open}>
      <DialogTitle>{NosachMap.get(initialState.type)?.title}</DialogTitle>
      <DialogContent>
        
      <TextField
          id="outlined-multiline-flexible"
          label="הערות עריכה"
          multiline
          maxRows={4}
          value={editingComment}
          onChange={(e)=>setEditingComment(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
      <Button 
      variant="contained"
      onClick={()=>{
        onSaveEntity({editingComment, type: initialState.type})
        }}>הוסף</Button>
      <Button onClick={onClose}>בטל</Button>
      </DialogActions>
    </Dialog>
  );
}

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
