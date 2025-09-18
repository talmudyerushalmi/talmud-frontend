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
import { iInternalLink, iLink, iSubline } from '../../../types/types';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkPopup from '../../popups/LinkPopup';
import { ListItemSecondaryAction } from '@mui/material';
import { hebrewMap } from '../../../inc/utils';
import LineService from '../../../services/line.service';
import { Snackbar, Alert } from '@mui/material';

interface Props {
  parallels: iInternalLink[];
  onUpdateInternalSources: (parallels: iInternalLink[]) => void;
  currentLineSublines?: iSubline[];
  currentMishna: any;
  currentLineNumber: string;
}
export const MakbilaMenu = (props: Props) => {
  const { parallels, onUpdateInternalSources, currentLineSublines, currentMishna, currentLineNumber } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({
    open: false, 
    message: '', 
    severity: 'success'
  });
  const btnCaption = `${t('Talmudic Parallels')} [${parallels.length}]`;
  return (
    <>
      <LinkPopup
        open={open}
        currentLineSublines={currentLineSublines}
        onClose={async (makbila: any) => {
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

            // Save the parallel immediately to database
            try {
              const updatedParallels = [...parallels, link];
              await LineService.saveParallels(
                currentMishna.tractate, 
                currentMishna.chapter, 
                currentMishna.mishna, 
                currentLineNumber, 
                updatedParallels
              );
              
              // Update UI after successful save
              onUpdateInternalSources(updatedParallels);
              
              // Success notification
              setSnackbar({
                open: true,
                message: 'הקישור נשמר בהצלחה!',
                severity: 'success'
              });
              
            } catch (error) {
              // Error notification
              setSnackbar({
                open: true,
                message: `שגיאה בשמירת הקישור: ${error instanceof Error ? error.message : 'Unknown error'}`,
                severity: 'error'
              });
              console.error('Save parallel error:', error);
            }
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
                onDelete={(parallels) => {
                  onUpdateInternalSources(parallels);
                }}
                onAdd={() => {
                  setOpen(true);
                }}
              />
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
      
      {/* Gentle notification snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({...prev, open: false}))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({...prev, open: false}))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

interface MakbilaListProps {
  makbilot: iInternalLink[];
  onAdd: Function;
  onDelete: (parallels: iInternalLink[]) => void;
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
              const newParallels = [...makbilot];
              newParallels.splice(index, 1);
              onDelete(newParallels);
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
