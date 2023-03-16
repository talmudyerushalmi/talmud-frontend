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
import { iInternalLink } from '../../../types/types';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import SyncIcon from '@mui/icons-material/Sync';
import LinkPopup from '../../popups/LinkPopup';
import { iSelectedNavigation } from '../../shared/ChooseMishna';
import { ListItemSecondaryAction, Tooltip } from '@mui/material';
import { hebrewMap } from '../../../inc/utils';

interface Props {
  parallels: iInternalLink[];
  onUpdateInternalSources: (parallels: iInternalLink[]) => void;
  onSyncParallels: () => void;
}
export const MakbilaMenu = (props: Props) => {
  const { parallels, onUpdateInternalSources, onSyncParallels } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const btnCaption = `${t('Talmudic Parallels')} [${parallels.length}]`;
  return (
    <>
      <LinkPopup
        open={open}
        onClose={(e: iSelectedNavigation) => {
          if (e) {
            const link = {
              linkText: `${e.selectedTractate.title_heb} ${hebrewMap.get(
                parseInt(e.selectedChapter.id)
              )} ${hebrewMap.get(parseInt(e.selectedMishna.mishna))} `,
              tractate: e.selectedTractate.id,
              chapter: e.selectedChapter.id,
              mishna: e.selectedMishna.mishna,
              lineNumber: e.selectedLine,
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
                onSync={() => {
                  onSyncParallels();
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
  onSync: () => void;
}
const MakbilaList = (props: MakbilaListProps) => {
  const { makbilot, onAdd, onDelete, onSync } = props;
  const { t } = useTranslation();

  const handleAdd = () => {
    onAdd();
  };

  const handleSync = () => {
    onSync();
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
        <Tooltip title={t('Add parallel') as string}>
          <ListItemButton dense onClick={handleAdd}>
            <AddIcon />
          </ListItemButton>
        </Tooltip>
        {makbilot.length > 0 ? (
          <Tooltip title={t('Sync parallels') as string}>
            <ListItemButton dense onClick={handleSync}>
              <SyncIcon />
            </ListItemButton>
          </Tooltip>
        ) : null}
      </ListItem>
    </List>
  );
};
