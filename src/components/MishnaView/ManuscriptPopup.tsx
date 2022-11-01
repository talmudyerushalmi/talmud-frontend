import React from 'react';
import { connect } from 'react-redux';
import { iManuscriptPopup } from '../../types/types';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { setManuscriptPopup } from '../../store/actions/mishnaViewActions';
import ZoomImage from '../manuscripts/ZoomImage';

const sx = {
  root: {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '4px',
    width: '50%',
    height: '50%',
    p: 1,
  },
};

const mapStateToProps = (state) => ({
  manuscriptPopup: state.mishnaView.manuscriptPopup,
});

const mapDispatchToProps = (dispatch) => ({
  closeManuscriptPopup: () => {
    dispatch(setManuscriptPopup(null));
  },
});

export interface iProps {
  manuscriptPopup: iManuscriptPopup;
  closeManuscriptPopup: () => void;
}

const ManuscriptPopup = (props: iProps) => {
  const { manuscriptPopup, closeManuscriptPopup } = props;
  return (
    <Modal
      sx={{
        border: 'none',
      }}
      open={Boolean(manuscriptPopup)}
      onClose={closeManuscriptPopup}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={sx.root}>
        <ZoomImage image={'https://picsum.photos/1200/2000'} />
      </Box>
    </Modal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ManuscriptPopup);
