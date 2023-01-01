import React from 'react';
import { connect } from 'react-redux';
import { iManuscript, iManuscriptPopup } from '../../types/types';
import Box from '@mui/material/Box';
import { setSublineData } from '../../store/actions/relatedActions';
import ZoomImage from '../manuscripts/ZoomImage';
import { Button, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Transition } from '../shared/Transition';
import { getManuscript } from '../../inc/manuscriptUtils';

const sx = {
  root: {
    border: 'none',
    direction: 'ltr', // the app changes the direction to rtl
  },
  zoomImage: { height: 'auto', width: '100%', overflow: 'hidden', boxShadow: '0px 7px 13px 0px #010122', mx: 'auto' },
};

const mapStateToProps = (state) => ({
  sublineData: state.related.sublineData,
  manuscriptsForChapter: state.related.manuscriptsForChapter,
});

const mapDispatchToProps = (dispatch) => ({
  closeManuscriptPopup: () => {
    dispatch(setSublineData(null));
  },
  setSublineData: (data: iManuscriptPopup) => {
    dispatch(setSublineData(data));
  },
});

export interface iProps {
  sublineData: iManuscriptPopup;
  closeManuscriptPopup: () => void;
  setSublineData: (data: iManuscriptPopup) => void;
  manuscriptsForChapter: iManuscript[];
}

const ManuscriptPopup = (props: iProps) => {
  const { sublineData, closeManuscriptPopup, setSublineData, manuscriptsForChapter } = props;

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
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              onClick={() => {
                const sublineDataPrev = {
                  line: (sublineData.manuscript && sublineData.manuscript.fromLine - 1) || 0,
                  subline: sublineData.subline,
                  synopsisCode: sublineData.synopsisCode,
                };
                const manuscript = getManuscript(manuscriptsForChapter, sublineDataPrev);
                sublineData.manuscript &&
                  setSublineData({
                    ...sublineDataPrev,
                    manuscript,
                  });
              }}>
              הקודם
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                const sublineDataNext = {
                  line: (sublineData.manuscript && sublineData.manuscript.toLine + 1) || 0,
                  subline: sublineData.subline,
                  synopsisCode: sublineData.synopsisCode,
                };
                const manuscript = getManuscript(manuscriptsForChapter, sublineDataNext);
                sublineData.manuscript &&
                  setSublineData({
                    ...sublineDataNext,
                    manuscript,
                  });
              }}>
              הבא
            </Button>
          </Box>
        </Box>
      </Box>
      <Box sx={sx.zoomImage}>
        <ZoomImage image={sublineData?.manuscript?.imageurl} />
      </Box>
    </Dialog>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ManuscriptPopup);
