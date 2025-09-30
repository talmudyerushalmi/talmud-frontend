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
      await LineService.saveParallels(
        tractate, 
        chapter, 
        currentMishna.mishna, 
        currentLineNumber, 
        updatedParallels
      );
      
      // Update UI after successful save
      onUpdateInternalSources(updatedParallels);
      
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
  return (
    <>
      <LinkPopup
        open={open}
        currentLineSublines={currentLineSublines}
        onClose={async (makbila: (iLink & { selectedSublineIndices?: number[]; currentSublineIndices?: number[]; }) | null) => {
          if (makbila) {
            let linkText = `${hebrewMap.get(makbila.chapter)} ${hebrewMap.get(makbila.mishna)} ${makbila.lineNumber}`;
            
            // Add multiple subline pairs info to the display text
            if (makbila.selectedSublineIndices && makbila.currentSublineIndices) {
              const currentIndices = makbila.currentSublineIndices as number[];
              const targetIndices = makbila.selectedSublineIndices as number[];
              
              if (currentIndices.length > 0 && targetIndices.length > 0) {
                const pairStrings = currentIndices.map((sourceIdx, i) => {
                  const targetIdx = targetIndices[i];
                  return `${sourceIdx + 1}→${targetIdx + 1}`;
                });
                linkText += ` [זוגות: ${pairStrings.join(', ')}]`;
              }
            }
            
            const link = {
              linkText,
              tractate: makbila.tractate,
              chapter: makbila.chapter,
              mishna: makbila.mishna,
              lineNumber: makbila.lineNumber,
              selectedSublineIndices: makbila.selectedSublineIndices,
              currentSublineIndices: makbila.currentSublineIndices,
            };

            // Handle add in parent - save to database and update UI
            await handleAddParallel(link);
          }
          setOpen(false);
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
                onAdd={() => {
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
}
const MakbilaList = (props: MakbilaListProps) => {
  const { makbilot, onAdd, onDelete } = props;

  const handleAdd = () => {
    onAdd();
  };
  const items = makbilot.map((makbila, index) => {
    const labelId = `checkbox-list-label-${index}`;

    return (
      <ListItem key={index} sx={{ width: '10rem' }}>
        <ListItemText id={labelId} primary={makbila.linkText} />

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
