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

interface Props {
  parallels: iInternalLink[];
  onUpdateInternalSources: (parallels: iInternalLink[]) => void;
  currentLineSublines?: iSubline[];
}
export const MakbilaMenu = (props: Props) => {
  const { parallels, onUpdateInternalSources, currentLineSublines } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const btnCaption = `${t('Talmudic Parallels')} [${parallels.length}]`;
  return (
    <>
      <LinkPopup
        open={open}
        currentLineSublines={currentLineSublines}
        onClose={(makbila: iLink | null) => {
          if (makbila) {
            let linkText = `${hebrewMap.get(makbila.chapter)} ${hebrewMap.get(makbila.mishna)} ${makbila.lineNumber}`;
            
            // Add subline info to the display text
            const sublineParts: string[] = [];
            if (makbila.currentSublineIndex !== undefined) {
              sublineParts.push(`נוכחית: ${makbila.currentSublineIndex + 1}`);
            }
            if (makbila.sublineIndex !== undefined) {
              sublineParts.push(`יעד: ${makbila.sublineIndex + 1}`);
            }
            if (sublineParts.length > 0) {
              linkText += ` [${sublineParts.join(', ')}]`;
            }
            
            const link = {
              linkText,
              tractate: makbila.tractate,
              chapter: makbila.chapter,
              mishna: makbila.mishna,
              lineNumber: makbila.lineNumber,
              ...(makbila.sublineIndex !== undefined && { sublineIndex: makbila.sublineIndex }),
              ...(makbila.currentSublineIndex !== undefined && { currentSublineIndex: makbila.currentSublineIndex }),
            };
            onUpdateInternalSources([...parallels, link]);
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
