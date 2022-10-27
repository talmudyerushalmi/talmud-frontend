import React from 'react';
import { connect } from 'react-redux';
import { iManuscriptPopup } from '../../types/types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { setManuscriptPopup } from '../../store/actions/mishnaViewActions';

const sx = {
  root: {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  },
};

const mapStateToProps = (state) => ({
  manuscriptPopup: state.mishnaView.manuscriptPopup,
});

const mapDispatchToProps = (dispatch) => ({
  setManuscriptPopup: () => {
    dispatch(setManuscriptPopup(null));
  },
});

export interface iProps {
  manuscriptPopup: iManuscriptPopup;
  setManuscriptPopup: () => void;
}

const ManuscriptPopup = (props: iProps) => {
  const { manuscriptPopup, setManuscriptPopup } = props;
  return (
    <Modal
      open={Boolean(manuscriptPopup)}
      onClose={setManuscriptPopup}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={sx.root}>
        <Typography>{manuscriptPopup?.manuscript}</Typography>
      </Box>
    </Modal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ManuscriptPopup);
