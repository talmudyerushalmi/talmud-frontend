import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { iManuscriptPopup } from '../../types/types';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { setManuscriptPopup } from '../../store/actions/mishnaViewActions';
import ZoomImage from '../manuscripts/ZoomImage';
import RelatedService from '../../services/RelatedService';

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
  currentRoute: state.navigation.currentRoute,
});

const mapDispatchToProps = (dispatch) => ({
  closeManuscriptPopup: () => {
    dispatch(setManuscriptPopup(null));
  },
});

export interface iProps {
  manuscriptPopup: iManuscriptPopup;
  currentRoute: any;
  closeManuscriptPopup: () => void;
}

const ManuscriptPopup = (props: iProps) => {
  const { manuscriptPopup, closeManuscriptPopup, currentRoute } = props;

  useEffect(() => {
    console.log('manuscriptPopup', manuscriptPopup);
    if (manuscriptPopup) {
      RelatedService.getRelated(
        currentRoute.tractate,
        currentRoute.chapter
      ).then((res) => {
        console.log('res', res);
      });
    }
  }, [manuscriptPopup]);

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
