import * as React from 'react';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, DialogActions, Divider, Typography, Box, Grid, Paper, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import ChooseMishnaForm from '../shared/ChooseMishna/ChooseMishnaForm';
import { iLink, iParallelLink, iTractate, iSubline } from '../../types/types';
import PageService from '../../services/pageService';

interface Props {
  open: boolean;
  onClose: (link: (iLink & { selectedSublineIndices?: number[]; currentSublineIndices?: number[]; }) | null) => void;
  currentLineSublines?: iSubline[];
  editingParallel?: iParallelLink | null; // For editing existing parallel
}

export default function LinkPopup(props: Props) {
  const { open, onClose, currentLineSublines = [], editingParallel = null } = props;
  const [makbila, setMakbila] = React.useState<iLink | null>(null);
  const [allTractates, setAllTractates] = React.useState<iTractate[]>([]);
  const [defaultValues, setDefaultValues] = React.useState<iLink>({
    tractate: '',
    chapter: '',
    mishna: '',
    lineNumber: '00001',
  });
  const [selectedLineSublines, setSelectedLineSublines] = React.useState<iSubline[]>([]);
  const [selectedSublineIndices, setSelectedSublineIndices] = React.useState<number[]>([]);
  const [currentSublineIndices, setCurrentSublineIndices] = React.useState<number[]>([]);

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

  // Reset all selections when dialog opens
  React.useEffect(() => {
    if (open) {
      if (editingParallel) {
        // Pre-populate for editing
        setMakbila({
          tractate: editingParallel.tractate,
          chapter: editingParallel.chapter,
          mishna: editingParallel.mishna,
          lineNumber: editingParallel.lineNumber
        });
        
        // Pre-populate for editing - use indices as stored (no swapping needed)
        setSelectedSublineIndices(editingParallel.selectedSublineIndices || []);
        setCurrentSublineIndices(editingParallel.currentSublineIndices || []);
        
        // Fetch the target line's sublines for editing
        PageService.getMishna(editingParallel.tractate, editingParallel.chapter, editingParallel.mishna)
          .then((mishnaData) => {
            const selectedLine = mishnaData.lines.find(l => l.lineNumber === editingParallel.lineNumber);
            if (selectedLine && selectedLine.sublines) {
              setSelectedLineSublines(selectedLine.sublines);
            } else {
              setSelectedLineSublines([]);
            }
          })
          .catch(() => {
            setSelectedLineSublines([]);
          });
      } else {
        // Reset for new parallel
        setSelectedSublineIndices([]);
        setCurrentSublineIndices([]);
        setMakbila(null);
        setSelectedLineSublines([]);
      }
    }
  }, [open, editingParallel]);

  const handleClose = () => {
    if (makbila) {
      // Return the link with the selected subline pairs (no swapping needed)
      const linkWithSublines = {
        ...makbila,
        selectedSublineIndices,
        currentSublineIndices
      };
      
      console.log('🔍 LinkPopup returning data:', {
        editing: !!editingParallel,
        selectedSublineIndices,
        currentSublineIndices,
        linkWithSublines
      });
      
      onClose(linkWithSublines);
    } else {
      onClose(makbila);
    }
  };

  // Check if selection is valid (equal number of sublines selected on both sides)
  const isSelectionValid = () => {
    if (currentLineSublines.length === 0 || selectedLineSublines.length === 0) {
      return makbila !== null; // If no sublines, just need a line selected
    }
    return currentSublineIndices.length > 0 && 
           currentSublineIndices.length === selectedSublineIndices.length;
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
      <DialogTitle>{editingParallel ? 'ערוך מקבילה' : 'בחר מקבילה'}</DialogTitle>

      <ChooseMishnaForm
        initValues={editingParallel ? {
          tractate: editingParallel.tractate,
          chapter: editingParallel.chapter,
          mishna: editingParallel.mishna,
          lineNumber: editingParallel.lineNumber
        } : defaultValues}
        allChapterAllowed={false}
        allTractates={allTractates}
        onNavigationUpdated={(e: iLink) => {
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
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>
                        השורה הנוכחית ({currentSublineIndices.length} נבחרו)
                      </FormLabel>
                      <Checkbox
                        size="small"
                        indeterminate={currentSublineIndices.length > 0 && currentSublineIndices.length < currentLineSublines.length}
                        checked={currentSublineIndices.length === currentLineSublines.length && currentLineSublines.length > 0}
                        onChange={(event) => {
                          if (event.target.checked) {
                            // Select all
                            setCurrentSublineIndices(currentLineSublines.map((_, index) => index));
                          } else {
                            // Deselect all
                            setCurrentSublineIndices([]);
                          }
                        }}
                        sx={{ 
                          '& .MuiSvgIcon-root': { fontSize: 20 },
                          ml: 1
                        }}
                      />
                    </Box>
                    <FormGroup>
                      {currentLineSublines.map((subline, index) => (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox 
                              checked={currentSublineIndices.includes(index)}
                              onChange={(event) => {
                                if (event.target.checked) {
                                  setCurrentSublineIndices([...currentSublineIndices, index].sort((a, b) => a - b));
                                } else {
                                  setCurrentSublineIndices(currentSublineIndices.filter(i => i !== index));
                                }
                              }}
                            />
                          }
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
                    </FormGroup>
                  </FormControl>
                </Paper>
              </Grid>
            )}

            {/* Target Line Sublines */}
            {selectedLineSublines.length > 0 && (
              <Grid item xs={currentLineSublines.length > 0 ? 6 : 12}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <FormControl component="fieldset" fullWidth>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>
                        השורה שנבחרה - יעד ({selectedSublineIndices.length} נבחרו)
                      </FormLabel>
                      <Checkbox
                        size="small"
                        indeterminate={selectedSublineIndices.length > 0 && selectedSublineIndices.length < selectedLineSublines.length}
                        checked={selectedSublineIndices.length === selectedLineSublines.length && selectedLineSublines.length > 0}
                        onChange={(event) => {
                          if (event.target.checked) {
                            // Select all
                            setSelectedSublineIndices(selectedLineSublines.map((_, index) => index));
                          } else {
                            // Deselect all
                            setSelectedSublineIndices([]);
                          }
                        }}
                        sx={{ 
                          '& .MuiSvgIcon-root': { fontSize: 20 },
                          ml: 1
                        }}
                      />
                    </Box>
                    <FormGroup>
                      {selectedLineSublines.map((subline, index) => (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox 
                              checked={selectedSublineIndices.includes(index)}
                              onChange={(event) => {
                                if (event.target.checked) {
                                  setSelectedSublineIndices([...selectedSublineIndices, index].sort((a, b) => a - b));
                                } else {
                                  setSelectedSublineIndices(selectedSublineIndices.filter(i => i !== index));
                                }
                              }}
                            />
                          }
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
                    </FormGroup>
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
        
        {/* Show validation message */}
        {(currentLineSublines.length > 0 || selectedLineSublines.length > 0) && !isSelectionValid() && (
          <Typography variant="body2" color="error" sx={{ mx: 2 }}>
            יש לבחור מספר זהה של תת-שורות משני הצדדים
          </Typography>
        )}
        
        <Button 
          onClick={handleClose}
          disabled={!isSelectionValid()}
          variant={isSelectionValid() ? "contained" : "outlined"}
        >
          {editingParallel ? 'עדכן' : 'בחר'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
