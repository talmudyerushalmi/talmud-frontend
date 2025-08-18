import * as React from 'react';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, DialogActions } from '@mui/material';
import ChooseMishnaForm from '../shared/ChooseMishna/ChooseMishnaForm';
import { iLink, iTractate } from '../../types/types';
import PageService from '../../services/pageService';

interface Props {
  open: boolean;
  onClose: (link: iLink | null) => void;
}

export default function LinkPopup(props: Props) {
  const { open, onClose } = props;
  const [makbila, setMakbila] = React.useState<iLink | null>(null);
  const [allTractates, setAllTractates] = React.useState<iTractate[]>([]);
  const [defaultValues, setDefaultValues] = React.useState<iLink>({
    tractate: '',
    chapter: '',
    mishna: '',
    lineNumber: '00001',
  });

  React.useEffect(() => {
    PageService.getAllTractates().then((tractates) => {
      setAllTractates(tractates);
      
      // Set default values from first tractate
      if (tractates && tractates.length > 0) {
        const firstTractate = tractates[0];
        const firstChapter = firstTractate.chapters?.[0];
        const firstMishna = firstChapter?.mishnaiot?.[0];
        
        setDefaultValues({
          tractate: firstTractate.id,
          chapter: firstChapter?.id || '',
          mishna: firstMishna?.mishna || '',
          lineNumber: '00001',
        });
      }
    });
  }, []);

  const handleClose = () => {
    onClose(makbila);
  };

  return (
    <Dialog
      sx={{ direction: 'ltr' }}
      open={open}
      maxWidth={'lg'}
      PaperProps={{
        sx: {
          padding: '1rem',
          width: '70%',
        },
      }}>
      <DialogTitle>בחר מקבילה</DialogTitle>

      <ChooseMishnaForm
        initValues={defaultValues}
        allChapterAllowed={false}
        allTractates={allTractates}
        onNavigationUpdated={(e: iLink) => {
          console.log('selected ', e);
          setMakbila(e);
        }}
      />
      <DialogActions>
        <Button
          onClick={() => {
            onClose(null);
          }}>
          בטל
        </Button>
        <Button onClick={handleClose}>בחר</Button>
      </DialogActions>
    </Dialog>
  );
}
