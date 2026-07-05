import React, { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import UnifiedEditPicker from '../components/MishnaView/UnifiedEditPicker';

type EditIntent = 'edit' | 'tagging' | null;

const mapStateToProps = (state: any) => ({
  currentRoute: state.navigation.currentRoute,
  currentMishna: state.navigation.currentMishna,
});

const AdminMenu = (props: any) => {
  const { currentRoute, currentMishna } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // When the currently-viewed halacha is unified, edit/tagging clicks first open a picker
  // dialog asking which underlying source halacha to open. `pickerIntent` keeps track of
  // which destination (edit page vs tagging page) the user is about to be sent to.
  const [pickerIntent, setPickerIntent] = useState<EditIntent>(null);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToEditingPage = useCallback(
    (intent: 'edit' | 'tagging', sourceMishnaId: string) => {
      const tractate = currentRoute?.tractate ? currentRoute.tractate : 'yevamot';
      const chapter = currentRoute?.chapter ? currentRoute.chapter : '001';
      const path = intent === 'edit' ? 'edit' : 'tagging';
      navigate(`/admin/${path}/${tractate}/${chapter}/${sourceMishnaId}`);
    },
    [currentRoute, navigate],
  );

  const startEditFlow = useCallback(
    (intent: 'edit' | 'tagging') => {
      handleClose();
      // Unified halacha → ask the editor which underlying source to open.
      if (currentMishna?._unified) {
        setPickerIntent(intent);
        return;
      }
      const mishna = currentRoute?.mishna ? currentRoute.mishna : '001';
      goToEditingPage(intent, mishna);
    },
    [currentMishna, currentRoute, goToEditingPage],
  );

  const handleEditMishna = useCallback(() => startEditFlow('edit'), [startEditFlow]);
  const handleTagging = useCallback(() => startEditFlow('tagging'), [startEditFlow]);

  const handleViewMishna = useCallback(() => {
    const tractate = currentRoute?.tractate ? currentRoute.tractate : 'yevamot';
    const chapter = currentRoute?.chapter ? currentRoute.chapter : '001';
    const mishna = currentRoute?.mishna ? currentRoute.mishna : '001';
    navigate(`/talmud/${tractate}/${chapter}/${mishna}`);
    handleClose();
  }, [currentRoute, navigate]);

  return (
    <>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Admin
      </Button>
      <Menu id="admin-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleViewMishna}>עמוד משנה</MenuItem>
        <MenuItem onClick={handleEditMishna}>עריכת משנה</MenuItem>
        <MenuItem onClick={handleTagging}>עורך תגיות</MenuItem>
        <MenuItem
          onClick={() => {
            const tractate = currentRoute?.tractate || 'yevamot';
            const chapter = currentRoute?.chapter || '001';
            navigate(`/admin/halacha-overrides/${tractate}/${chapter}`);
            handleClose();
          }}>
          עריכת מבנה הפרק
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(`/admin/comments/moderation`);
            handleClose();
          }}>
          בדיקת הערות
        </MenuItem>
      </Menu>

      <UnifiedEditPicker
        open={pickerIntent !== null}
        sources={currentMishna?._unified?.sources ?? null}
        onCancel={() => setPickerIntent(null)}
        onPick={(sourceId) => {
          const intent = pickerIntent;
          setPickerIntent(null);
          if (intent) goToEditingPage(intent, sourceId);
        }}
      />
    </>
  );
};

export default connect(mapStateToProps)(AdminMenu);
