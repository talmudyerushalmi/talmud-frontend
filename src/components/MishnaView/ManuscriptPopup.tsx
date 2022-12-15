import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { iManuscript, iManuscriptPopup } from '../../types/types';
import Box from '@mui/material/Box';
import { setManuscriptsForChapter, setSublineData } from '../../store/actions/relatedActions';
import ZoomImage from '../manuscripts/ZoomImage';
import { getImageUrl } from '../../inc/manuscriptUtils';
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
    <Dialog
      sx={sx.root}
      fullScreen
      open={Boolean(sublineData)}
      onClose={closeManuscriptPopup}
      TransitionComponent={Transition}>
      <Box display={'flex'} textAlign="center" position="relative" justifyContent="center">
        <Box position="absolute" left="0"> {/* left changes to right */}
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
        <ZoomImage image={imageURL} />
      </Box>
    </Dialog>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ManuscriptPopup);
