import * as React from 'react';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, DialogActions, Divider, Typography, Box } from '@mui/material';
import ChooseMishnaForm from '../shared/ChooseMishna/ChooseMishnaForm';
import { iLink, iTractate, iSubline } from '../../types/types';
import PageService from '../../services/pageService';
import { Autocomplete, TextField } from '@mui/material';

interface Props {
  open: boolean;
  onClose: (link: iLink | null) => void;
  currentLineSublines?: iSubline[];
}

export default function LinkPopup(props: Props) {
  const { open, onClose, currentLineSublines = [] } = props;
  const [makbila, setMakbila] = React.useState<iLink | null>(null);
  const [allTractates, setAllTractates] = React.useState<iTractate[]>([]);
  const [defaultValues, setDefaultValues] = React.useState<iLink>({
    tractate: '',
    chapter: '',
    mishna: '',
    lineNumber: '00001',
  });
  const [selectedLineSublines, setSelectedLineSublines] = React.useState<iSubline[]>([]);
  const [selectedSublineIndex, setSelectedSublineIndex] = React.useState<number | undefined>(undefined);
  const [currentSublineIndex, setCurrentSublineIndex] = React.useState<number | undefined>(undefined);

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
    if (makbila) {
      // Return the link with both subline indices
      onClose({
        ...makbila,
        ...(selectedSublineIndex !== undefined && { sublineIndex: selectedSublineIndex }),
        ...(currentSublineIndex !== undefined && { currentSublineIndex: currentSublineIndex })
      });
    } else {
      onClose(makbila);
    }
  };

  return (
    <Dialog
      sx={{ direction: 'ltr' }}
      open={open}
      maxWidth={'lg'}
      PaperProps={{
        sx: {
          padding: '1rem',
          width: '90%',
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
          
          // When a line is selected, fetch its sublines
          if (e.tractate && e.chapter && e.mishna && e.lineNumber) {
            PageService.getMishna(e.tractate, e.chapter, e.mishna)
              .then((mishnaData) => {
                const selectedLine = mishnaData.lines.find(l => l.lineNumber === e.lineNumber);
                if (selectedLine && selectedLine.sublines) {
                  setSelectedLineSublines(selectedLine.sublines);
                } else {
                  setSelectedLineSublines([]);
                }
              })
              .catch(() => {
                setSelectedLineSublines([]);
              });
          }
        }}
      />

      {/* Sublines of the picked line */}
      {selectedLineSublines.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            בחר תת-שורה מהשורה שנבחרה:
          </Typography>
          <Autocomplete
            sx={{ minWidth: 300 }}
            value={selectedLineSublines[selectedSublineIndex || 0] || null}
            onChange={(event, newValue) => {
              if (newValue) {
                const index = selectedLineSublines.findIndex(s => s === newValue);
                setSelectedSublineIndex(index);
              }
            }}
            options={selectedLineSublines}
            getOptionLabel={(option) => {
              const index = selectedLineSublines.findIndex(s => s === option);
              const truncatedText = option.text.substring(0, 50) + (option.text.length > 50 ? '...' : '');
              return `${index + 1}: ${truncatedText}`;
            }}
            renderInput={(params) => (
              <TextField {...params} label="תת-שורה" variant="outlined" />
            )}
          />
        </>
      )}

      {/* Current line sublines picker */}
      {currentLineSublines.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            בחר תת-שורה מהשורה הנוכחית:
          </Typography>
          <Autocomplete
            sx={{ minWidth: 300 }}
            value={currentLineSublines[currentSublineIndex || 0] || null}
            onChange={(event, newValue) => {
              if (newValue) {
                const index = currentLineSublines.findIndex(s => s === newValue);
                setCurrentSublineIndex(index);
              }
            }}
            options={currentLineSublines}
            getOptionLabel={(option) => {
              const index = currentLineSublines.findIndex(s => s === option);
              const truncatedText = option.text.substring(0, 50) + (option.text.length > 50 ? '...' : '');
              return `${index + 1}: ${truncatedText}`;
            }}
            renderInput={(params) => (
              <TextField {...params} label="תת-שורה נוכחית" variant="outlined" />
            )}
          />
        </>
      )}
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
