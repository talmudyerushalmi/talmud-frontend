import * as React from 'react';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import ChooseMishnaBar from '../shared/ChooseMishnaBar';
import ChooseMishna, { iSelectedNavigation } from '../shared/ChooseMishna';
import { Button, DialogActions } from '@mui/material';

interface Props {
  open: boolean;
  onClose: Function;
}

export default function LinkPopup(props: Props) {
  const { open, onClose } = props;
  const [makbila, setMakbila] = React.useState({})


  const handleClose = () => {
    //  setOpen(false);
    console.log('val ', makbila);
    onClose(makbila);
  };

  return (
    <Dialog 
    sx={{direction:'ltr'}}
    open={open} 
    maxWidth={'lg'}
    PaperProps={{
      sx:{
      padding: '1rem',
      width:'70%'}}}>
      <DialogTitle>בחר מקבילה</DialogTitle>

      <ChooseMishna
        allChapterAllowed={false}
        onNavigationUpdated={(e: iSelectedNavigation) => {
          console.log('selected ', e);
          setMakbila(e)
        }}
      />
      <DialogActions>
        <Button onClick={handleClose}>בחר</Button>
      </DialogActions>
    </Dialog>
  );
}
