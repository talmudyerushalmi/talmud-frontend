import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

const mapStateToProps = (state: any) => ({
  currentRoute: state.navigation.currentRoute,
});

const AdminMenu = (props: any) => {
  const { currentRoute } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const history = useHistory();

  const handleEditMishna = useCallback(() => {
    const tractate = currentRoute.tractate ? currentRoute.tractate : 'yevamot';
    const chapter = currentRoute.chapter ? currentRoute.chapter : '001';
    const mishna = currentRoute.mishna ? currentRoute.mishna : '001';
    history.push(`/admin/edit/${tractate}/${chapter}/${mishna}`);
    handleClose();
  }, [currentRoute]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewMishna = useCallback(() => {
    const tractate = currentRoute.tractate ? currentRoute.tractate : 'yevamot';
    const chapter = currentRoute.chapter ? currentRoute.chapter : '001';
    const mishna = currentRoute.mishna ? currentRoute.mishna : '001';
    history.push(`/talmud/${tractate}/${chapter}/${mishna}`);
    handleClose();
  }, [currentRoute]);

  return (
    <>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Admin
      </Button>
      <Menu id="admin-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleViewMishna}>עמוד משנה</MenuItem>
        <MenuItem onClick={handleEditMishna}>עריכת משנה</MenuItem>
      </Menu>
    </>
  );
};

export default connect(mapStateToProps)(AdminMenu);
