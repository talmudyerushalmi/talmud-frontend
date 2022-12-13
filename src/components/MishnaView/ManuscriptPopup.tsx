import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { iManuscript, iManuscriptPopup } from '../../types/types';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { setManuscriptsForChapter, setSublineData } from '../../store/actions/relatedActions';
import ZoomImage from '../manuscripts/ZoomImage';
import { getImageUrl } from '../../inc/manuscriptUtils';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const sx = {
  root: {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '4px',
    p: 1,
    width: '100%',
    height: '100%',
    direction: 'ltr',
  },
};

const mapStateToProps = (state) => ({
  sublineData: state.related.sublineData,
  currentRoute: state.navigation.currentRoute,
  manuscriptsForChapter: state.related.manuscriptsForChapter,
});

const mapDispatchToProps = (dispatch) => ({
  closeManuscriptPopup: () => {
    dispatch(setSublineData(null));
  },
  setManuscriptsForChapter: (chapter: string, tractate: string) => {
    dispatch(setManuscriptsForChapter(chapter, tractate));
  },
});

export interface iProps {
  sublineData: iManuscriptPopup;
  currentRoute: any;
  closeManuscriptPopup: () => void;
  setManuscriptsForChapter: (chapter: string, tractate: string) => void;
  manuscriptsForChapter: iManuscript[];
}

const ManuscriptPopup = (props: iProps) => {
  const { sublineData, closeManuscriptPopup, currentRoute, setManuscriptsForChapter, manuscriptsForChapter } = props;
  const [imageURL, setImageURL] = useState('');

  useEffect(() => {
    setImageURL(getImageUrl(manuscriptsForChapter, sublineData));
  }, [sublineData?.subline.index, sublineData?.line]);

  useEffect(() => {
    setManuscriptsForChapter(currentRoute?.tractate, currentRoute?.chapter);
  }, [currentRoute?.chapter, currentRoute?.tractate]);

  return (
    <Modal
      sx={{
        border: 'none',
        width: '100%',
        height: '100%',
      }}
      open={Boolean(sublineData)}
      onClose={closeManuscriptPopup}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={sx.root}>
        <IconButton onClick={closeManuscriptPopup}>
          <CloseIcon />
        </IconButton>
        <Box textAlign="center" sx={{ direction: 'ltr' }}>
          שורה - {sublineData?.subline.index}
          <br />
          <b> {sublineData?.subline.text} </b>
        </Box>
        <Box sx={{ height: '100%', width: '60%', boxShadow: '0px 7px 13px 0px #010122', mx: 'auto' }}>
          <ZoomImage image={imageURL} />
        </Box>
      </Box>
    </Modal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ManuscriptPopup);
