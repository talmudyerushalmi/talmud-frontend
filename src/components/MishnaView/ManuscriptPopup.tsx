import React from 'react';
import { connect } from 'react-redux';
import { iManuscriptPopup } from '../../types/types';
import Box from '@mui/material/Box';
import { setSublineData } from '../../store/actions/relatedActions';
import ZoomImage from '../manuscripts/ZoomImage';
import { Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Transition } from '../shared/Transition';

const sx = {
  root: {
    border: 'none',
    direction: 'ltr', // the app changes the direction to rtl
  },
  zoomImage: { height: 'auto', width: '100%', overflow: 'hidden', boxShadow: '0px 7px 13px 0px #010122', mx: 'auto' },
};

const mapStateToProps = (state) => ({
  sublineData: state.related.sublineData,
});

const mapDispatchToProps = (dispatch) => ({
  closeManuscriptPopup: () => {
    dispatch(setSublineData(null));
  },
});

export interface iProps {
  sublineData: iManuscriptPopup;
  closeManuscriptPopup: () => void;
}

const ManuscriptPopup = (props: iProps) => {
  const { sublineData, closeManuscriptPopup } = props;

  return (
    <Dialog
      sx={sx.root}
      fullScreen
      open={Boolean(sublineData)}
      onClose={closeManuscriptPopup}
      TransitionComponent={Transition}>
      <Box display={'flex'} textAlign="center" position="relative" justifyContent="center">
        <Box position="absolute" left="0">
          {/* left changes to right */}
          <IconButton onClick={closeManuscriptPopup}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box textAlign="center" sx={{ justifySelf: 'center' }}>
          שורה - {sublineData?.subline.index}
          <br />
          <b> {sublineData?.subline.text} </b>
        </Box>
      </Box>
      <Box sx={sx.zoomImage}>
        <ZoomImage image={sublineData?.imageUrl} />
      </Box>
    </Dialog>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ManuscriptPopup);
