import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useHistory } from 'react-router';

export default function AdminMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const history = useHistory();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditLine = () => {
      history.push("/admin/edit/yevamot/001/001/00001");
      handleClose();
  }

  const handleEditMishna = () => {
    history.push("/admin/edit/yevamot/001/001");
    handleClose();
}


  return (
    <>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Admin
      </Button>
      <Menu
        id="admin-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleEditMishna}>עריכת משנה</MenuItem>
        <MenuItem onClick={handleEditLine}>עריכת שורה</MenuItem>
      </Menu>
    </>
  );
}
