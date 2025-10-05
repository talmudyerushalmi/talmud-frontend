import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { iParallelLink, iLink, iSubline, iMishna } from '../../../types/types';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LinkPopup from '../../popups/LinkPopup';
import { ListItemSecondaryAction } from '@mui/material';
import { hebrewMap } from '../../../inc/utils';
import { getTractate, getChapter } from '../../../inc/mishnaUtils';
import LineService from '../../../services/line.service';
import { useSnackbar } from '../../../hooks/useSnackbar';
import NotificationSnackbar from '../../shared/NotificationSnackbar';

interface Props {
  parallels: iParallelLink[];
  onUpdateInternalSources: (parallels: iParallelLink[]) => void;
  currentLineSublines?: iSubline[];
  currentMishna: iMishna;
  currentLineNumber: string;
}
export const MakbilaMenu = (props: Props) => {
  const { parallels, onUpdateInternalSources, currentLineSublines, currentMishna, currentLineNumber } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [editingParallel, setEditingParallel] = useState<iParallelLink | null>(null);
  const { snackbar, showSuccess, showError, hideSnackbar } = useSnackbar();
  const btnCaption = `${t('Talmudic Parallels')} [${parallels.length}]`;
  
  // Generic function to save parallels and handle UI updates
  const saveParallelsToDb = async (updatedParallels: iParallelLink[], successMessage: string, errorPrefix: string) => {
    const tractate = getTractate(currentMishna);
    const chapter = getChapter(currentMishna);
    
    if (!tractate || !chapter) {
      showError('לא ניתן לשמור - מידע המשנה לא זמין עדיין');
      return;
    }
    
    try {
      // SIMPLE FIX: Check if any parallels are in the same mishna
      const sameMishnaParallels = updatedParallels.filter(p => 
        p.tractate === tractate && 
        p.chapter === chapter && 
        p.mishna === currentMishna.mishna
      );
      
      if (sameMishnaParallels.length > 0) {
        console.log('🔍 Detected same-mishna parallels, using sequential saves to avoid conflicts');
        
        // For same-mishna parallels, save each line separately with a delay
        for (const parallel of sameMishnaParallels) {
          // Save to current line first
          await LineService.saveParallels(
            tractate, 
            chapter, 
            currentMishna.mishna, 
            currentLineNumber, 
            [parallel] // Save one at a time
          );
          
          // Small delay to avoid conflicts
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // Save reciprocal to the parallel line
          const reciprocalParallel = {
            ...parallel,
            tractate,
            chapter,
            mishna: currentMishna.mishna,
            lineNumber: currentLineNumber,
            // Invert the indices for the reciprocal
            selectedSublineIndices: parallel.currentSublineIndices,
            currentSublineIndices: parallel.selectedSublineIndices,
          };
          
          await LineService.saveParallels(
            parallel.tractate,
            parallel.chapter,
            parallel.mishna || '',
            parallel.lineNumber || '',
            [reciprocalParallel]
          );
          
          console.log('🔍 Saved same-mishna parallel pair:', {
            original: `${currentLineNumber} -> ${parallel.lineNumber}`,
            reciprocal: `${parallel.lineNumber} -> ${currentLineNumber}`
          });
        }
        
        // Now get the updated data for UI
        const response = await LineService.saveParallels(
          tractate, 
          chapter, 
          currentMishna.mishna, 
          currentLineNumber, 
          updatedParallels
        );
        
        const currentLine = response.lines?.find(line => line.lineNumber === currentLineNumber);
        const rawBackendParallels = currentLine?.parallels || updatedParallels;
        
        const convertedParallels = rawBackendParallels.map(parallel => ({
          ...parallel,
          selectedSublineIndices: (parallel as any).sublinePairs?.map((pair: any) => pair.targetIndex) || [],
          currentSublineIndices: (parallel as any).sublinePairs?.map((pair: any) => pair.sourceIndex) || [],
        }));
        
        onUpdateInternalSources(convertedParallels);
        
      } else {
        // For different-mishna parallels, use the normal approach
        const response = await LineService.saveParallels(
          tractate, 
          chapter, 
          currentMishna.mishna, 
          currentLineNumber, 
          updatedParallels
        );
        
        const currentLine = response.lines?.find(line => line.lineNumber === currentLineNumber);
        const rawBackendParallels = currentLine?.parallels || updatedParallels;
        
        const convertedParallels = rawBackendParallels.map(parallel => ({
          ...parallel,
          selectedSublineIndices: (parallel as any).sublinePairs?.map((pair: any) => pair.targetIndex) || [],
          currentSublineIndices: (parallel as any).sublinePairs?.map((pair: any) => pair.sourceIndex) || [],
        }));
        
        onUpdateInternalSources(convertedParallels);
      }
      
      // Success notification
      showSuccess(successMessage);
      
    } catch (error) {
      // Error notification
      showError(`${errorPrefix}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Handle adding a new parallel
  const handleAddParallel = async (link: iParallelLink) => {
    const updatedParallels = [...parallels, link];
    await saveParallelsToDb(updatedParallels, 'המקבילה נשמרה בהצלחה!', 'שגיאה בשמירת המקבילה');
  };
  
  // Handle deleting a parallel
  const handleDeleteParallel = async (index: number) => {
    const updatedParallels = [...parallels];
    updatedParallels.splice(index, 1);
    await saveParallelsToDb(updatedParallels, 'המקבילה נמחקה בהצלחה!', 'שגיאה במחיקת המקבילה');
  };

  // Handle editing a parallel (delete + create approach)
  const handleEditParallel = async (editedParallel: iParallelLink) => {
    // Find the index of the parallel being edited
    const indexToReplace = parallels.findIndex(p => 
      p.tractate === editingParallel?.tractate &&
      p.chapter === editingParallel?.chapter &&
      p.mishna === editingParallel?.mishna &&
      p.lineNumber === editingParallel?.lineNumber
    );
    
    if (indexToReplace !== -1) {
      const updatedParallels = [...parallels];
      updatedParallels[indexToReplace] = editedParallel;
      await saveParallelsToDb(updatedParallels, 'המקבילה עודכנה בהצלחה!', 'שגיאה בעדכון המקבילה');
    }
  };
  return (
    <>
      <LinkPopup
        open={open}
        currentLineSublines={currentLineSublines}
        editingParallel={editingParallel}
        onClose={async (makbila: (iLink & { selectedSublineIndices?: number[]; currentSublineIndices?: number[]; }) | null) => {
          if (makbila) {
            console.log('🔍 MakbilaList received data from LinkPopup:', {
              editing: !!editingParallel,
              makbila
            });
            
            const link = {
              linkText: '', // Backend will generate Hebrew linkText
              tractate: makbila.tractate,
              chapter: makbila.chapter,
              mishna: makbila.mishna,
              lineNumber: makbila.lineNumber,
              selectedSublineIndices: makbila.selectedSublineIndices,
              currentSublineIndices: makbila.currentSublineIndices,
            };

            console.log('🔍 MakbilaList sending to backend:', link);

            if (editingParallel) {
              // Handle edit
              await handleEditParallel(link);
            } else {
              // Handle add
              await handleAddParallel(link);
            }
          }
          setOpen(false);
          setEditingParallel(null); // Reset editing state
        }}
      />
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <Button variant={parallels.length > 0 ? 'contained' : 'outlined'} {...bindTrigger(popupState)}>
              {btnCaption}
            </Button>
            <Menu {...bindMenu(popupState)}>
              <MakbilaList
                makbilot={parallels}
                onDelete={handleDeleteParallel}
                onEdit={(index: number) => {
                  setEditingParallel(parallels[index]);
                  setOpen(true);
                }}
                onAdd={() => {
                  setEditingParallel(null); // Ensure we're not editing
                  setOpen(true);
                }}
              />
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
      
      {/* Notification snackbar */}
      <NotificationSnackbar 
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </>
  );
};

interface MakbilaListProps {
  makbilot: iParallelLink[];
  onAdd: Function;
  onDelete: (index: number) => void;
  onEdit: (index: number) => void;
}
const MakbilaList = (props: MakbilaListProps) => {
  const { makbilot, onAdd, onDelete, onEdit } = props;

  const handleAdd = () => {
    onAdd();
  };
  
  const items = makbilot.map((makbila, index) => {
    const labelId = `checkbox-list-label-${index}`;
    
    // Check if this parallel has subline indexes - if not, show in red
    const hasIndexes = makbila.selectedSublineIndices && makbila.selectedSublineIndices.length > 0;
    const textColor = hasIndexes ? 'inherit' : 'error.main';
    
    // Just use the linkText from backend - it already has Hebrew tractate name
    const displayText = makbila.linkText;

    return (
      <ListItem key={index} sx={{ width: '10rem' }}>
        <ListItemText 
          id={labelId} 
          primary={displayText}
          sx={{ color: textColor }}
        />

        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="open"
            onClick={() => {
              window.open(`/admin/edit/${makbila.tractate}/${makbila.chapter}/${makbila.mishna}/${makbila.lineNumber}`);
            }}>
            <OpenInNewIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={() => {
              onEdit(index);
            }}>
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              onDelete(index);
            }}
            edge="end"
            aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  });
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {items}
      <ListItem>
        <ListItemButton dense onClick={handleAdd}>
          <AddIcon />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
