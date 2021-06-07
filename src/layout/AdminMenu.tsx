import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { getFirstLine } from '../inc/utils';

const mapStateToProps = (state:any) => ({
    currentTractate: state.general.currentTractate,
    currentChapter: state.general.currentChapter,
    currentMishna: state.general.currentMishna,
    currentLine: state.general.currentLine,
})

const AdminMenu = (props:any) => {
  const { currentTractate, currentChapter, currentMishna, currentLine  } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const history = useHistory();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditLine = () => {
      console.log(currentTractate)
      const tractate = currentTractate ? currentTractate.id : 'yevamot';
      const chapter = currentChapter ? currentChapter.id : '001';
      const mishna = currentMishna ? currentMishna.mishna : '001';
      const line = currentLine ? currentLine.lineNumber : getFirstLine(currentMishna)
      history.push(`/admin/edit/${tractate}/${chapter}/${mishna}/${line}`);
      handleClose();
  }

  const handleEditMishna = () => {
    const tractate = currentTractate ? currentTractate.id : 'yevamot';
    const chapter = currentChapter ? currentChapter.id : '001';
    const mishna = currentMishna ? currentMishna.mishna : '001';
    history.push(`/admin/edit/${tractate}/${chapter}/${mishna}`);
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

export default connect(mapStateToProps)(AdminMenu);