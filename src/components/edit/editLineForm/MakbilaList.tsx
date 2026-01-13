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
import { Box } from '@mui/material';
import { hebrewMap } from '../../../inc/utils';
import { getTractate, getChapter } from '../../../inc/mishnaUtils';
import LineService from '../../../services/line.service';
import PageService from '../../../services/pageService';
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
  
  // Handle adding a new parallel (using NEW granular operation)
  const handleAddParallel = async (link: iParallelLink) => {
    const tractate = getTractate(currentMishna);
    const chapter = getChapter(currentMishna);
    
    if (!tractate || !chapter) {
      showError('לא ניתן לשמור - מידע המשנה לא זמין עדיין');
      return;
    }

    try {
      // Backend now handles both same-mishna and cross-mishna reciprocal addition
      await LineService.addParallel(tractate, chapter, currentMishna.mishna, currentLineNumber, link);
      
      // Refresh the UI by refetching the mishna
      const updatedMishna = await PageService.getMishna(tractate, chapter, currentMishna.mishna);
      const currentLine = updatedMishna.lines?.find(line => line.lineNumber === currentLineNumber);
      // PageService.getMishna() already converts sublinePairs to selectedSublineIndices
      const updatedParallels = currentLine?.parallels || [];
      
      onUpdateInternalSources(updatedParallels);
      showSuccess('המקבילה נוספה בהצלחה!');
    } catch (error) {
      console.error('Error adding parallel:', error);
      showError('שגיאה בהוספת המקבילה');
    }
  };
  
  // Handle deleting a parallel (using NEW granular operation)
  const handleDeleteParallel = async (index: number) => {
    const tractate = getTractate(currentMishna);
    const chapter = getChapter(currentMishna);
    
    if (!tractate || !chapter) {
      showError('לא ניתן למחוק - מידע המשנה לא זמין עדיין');
      return;
    }

    const parallelToDelete = parallels[index];
    if (!parallelToDelete) {
      showError('מקבילה לא נמצאה');
      return;
    }

    try {
      // Backend now handles both same-mishna and cross-mishna reciprocal deletion
      await LineService.deleteParallel(tractate, chapter, currentMishna.mishna, currentLineNumber, parallelToDelete);
      
      // Refresh the UI by refetching the mishna
      const updatedMishna = await PageService.getMishna(tractate, chapter, currentMishna.mishna);
      const currentLine = updatedMishna.lines?.find(line => line.lineNumber === currentLineNumber);
      // PageService.getMishna() already converts sublinePairs to selectedSublineIndices
      const updatedParallels = currentLine?.parallels || [];
      
      onUpdateInternalSources(updatedParallels);
      showSuccess('המקבילה נמחקה בהצלחה!');
    } catch (error) {
      console.error('Error deleting parallel:', error);
      showError('שגיאה במחיקת המקבילה');
    }
  };

  // Handle editing a parallel (using NEW granular operation)
  const handleEditParallel = async (editedParallel: iParallelLink) => {
    const tractate = getTractate(currentMishna);
    const chapter = getChapter(currentMishna);
    
    if (!tractate || !chapter) {
      showError('לא ניתן לעדכן - מידע המשנה לא זמין עדיין');
      return;
    }

    if (!editingParallel) {
      showError('מקבילה מקורית לא נמצאה');
      return;
    }

    try {
      // Backend now handles both same-mishna and cross-mishna reciprocal updates
      await LineService.updateParallel(tractate, chapter, currentMishna.mishna, currentLineNumber, editedParallel);
      
      // Refresh the UI by refetching the mishna
      const updatedMishna = await PageService.getMishna(tractate, chapter, currentMishna.mishna);
      const currentLine = updatedMishna.lines?.find(line => line.lineNumber === currentLineNumber);
      const updatedParallels = currentLine?.parallels || [];
      
      onUpdateInternalSources(updatedParallels);
      showSuccess('המקבילה עודכנה בהצלחה!');
    } catch (error) {
      console.error('Error updating parallel:', error);
      showError('שגיאה בעדכון המקבילה');
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
      <ListItem key={index} sx={{ width: '100%', minWidth: '20rem', display: 'flex', alignItems: 'center' }}>
        <ListItemButton
          onClick={() => {
            window.open(`/admin/edit/${makbila.tractate}/${makbila.chapter}/${makbila.mishna}/${makbila.lineNumber}`);
          }}
          sx={{ flex: '1 1 auto', minWidth: 0 }}
        >
          <ListItemText 
            id={labelId} 
            primary={displayText}
            sx={{ color: textColor }}
          />
        </ListItemButton>

        <Box sx={{ display: 'flex' }}>
          <IconButton
            size="small"
            aria-label="open"
            onClick={() => {
              window.open(`/admin/edit/${makbila.tractate}/${makbila.chapter}/${makbila.mishna}/${makbila.lineNumber}`);
            }}>
            <OpenInNewIcon />
          </IconButton>
          <IconButton
            size="small"
            aria-label="edit"
            onClick={() => {
              onEdit(index);
            }}>
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              onDelete(index);
            }}
            aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Box>
      </ListItem>
    );
  });
  return (
    <List sx={{ width: '100%', minWidth: '20rem', bgcolor: 'background.paper' }}>
      {items}
      <ListItem>
        <ListItemButton dense onClick={handleAdd}>
          <AddIcon />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
