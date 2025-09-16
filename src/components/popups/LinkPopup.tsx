import * as React from 'react';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, DialogActions, Divider, Typography, Box, Grid, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import ChooseMishnaForm from '../shared/ChooseMishna/ChooseMishnaForm';
import { iLink, iTractate, iSubline } from '../../types/types';
import PageService from '../../services/pageService';

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
      const linkWithSublines = {
        ...makbila,
        ...(selectedSublineIndex !== undefined && { sublineIndex: selectedSublineIndex }),
        ...(currentSublineIndex !== undefined && { currentSublineIndex: currentSublineIndex })
      };
      onClose(linkWithSublines);
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

      {/* Side-by-side subline selection */}
      {(selectedLineSublines.length > 0 || currentLineSublines.length > 0) && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
            בחר תת-שורות מתואמות
          </Typography>
          
          <Grid container spacing={3}>
            {/* Current Line Sublines */}
            {currentLineSublines.length > 0 && (
              <Grid item xs={6}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold' }}>
                      השורה הנוכחית
                    </FormLabel>
                    <RadioGroup
                      value={currentSublineIndex !== undefined ? currentSublineIndex.toString() : ''}
                      onChange={(event) => {
                        const index = parseInt(event.target.value);
                        setCurrentSublineIndex(index);
                      }}
                    >
                      {currentLineSublines.map((subline, index) => (
                        <FormControlLabel
                          key={index}
                          value={index.toString()}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="subtitle2" color="primary">
                                תת-שורה {index + 1}
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                direction: 'rtl', 
                                textAlign: 'right',
                                lineHeight: 1.6,
                                maxWidth: '300px'
                              }}>
                                {subline.text}
                              </Typography>
                            </Box>
                          }
                          sx={{ 
                            alignItems: 'flex-start',
                            mb: 2,
                            '& .MuiFormControlLabel-label': {
                              width: '100%'
                            }
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Paper>
              </Grid>
            )}

            {/* Target Line Sublines */}
            {selectedLineSublines.length > 0 && (
              <Grid item xs={currentLineSublines.length > 0 ? 6 : 12}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold' }}>
                      השורה שנבחרה (יעד)
                    </FormLabel>
                    <RadioGroup
                      value={selectedSublineIndex !== undefined ? selectedSublineIndex.toString() : ''}
                      onChange={(event) => {
                        const index = parseInt(event.target.value);
                        setSelectedSublineIndex(index);
                      }}
                    >
                      {selectedLineSublines.map((subline, index) => (
                        <FormControlLabel
                          key={index}
                          value={index.toString()}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="subtitle2" color="primary">
                                תת-שורה {index + 1}
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                direction: 'rtl', 
                                textAlign: 'right',
                                lineHeight: 1.6,
                                maxWidth: '300px'
                              }}>
                                {subline.text}
                              </Typography>
                            </Box>
                          }
                          sx={{ 
                            alignItems: 'flex-start',
                            mb: 2,
                            '& .MuiFormControlLabel-label': {
                              width: '100%'
                            }
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Paper>
              </Grid>
            )}
          </Grid>
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
