import React, { useEffect } from 'react';
import { Grid, useTheme } from '@mui/material';
import MainText from '../components/MishnaView/MainText';
import MishnaText from '../components/MishnaView/MishnaText';
import { connect } from 'react-redux';
import ExcerptsSection from '../components/MishnaView/ExcerptsSection';
import MishnaViewOptions from '../components/MishnaView/MishnaViewOptions';
import { useParams } from 'react-router';
import { getHTMLFromRawContent } from '../inc/editorUtils';
import { iMishna } from '../types/types';
import { routeObject } from '../store/reducers/navigationReducer';
import { getMishna } from '../store/actions/navigationActions';
import { setMishnaViewOptions } from '../store/actions/mishnaViewActions';
import ManuscriptPopup from '../components/MishnaView/ManuscriptPopup';

const DEFAULT_OPTIONS = {
  showSugiaName: true,
};
const mapStateToProps = (state) => ({
  currentMishna: state.navigation.currentMishna,
  filteredExcerpts: state.mishnaView.filteredExcerpts,
  selectedExcerpt: state.mishnaView.selectedExcerpt,
  detailsExcerptPopup: state.mishnaView.detailsExcerptPopup,
  expanded: state.mishnaView.expanded,
  loading: state.navigation.loading,
  // comments: state.comments.privateComments,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  setMishnaViewOptions: () => {
    dispatch(setMishnaViewOptions(DEFAULT_OPTIONS));
  },
  getMishna: (tractate: string, chapter: string, mishna: string) => {
    dispatch(getMishna(tractate, chapter, mishna));
  },
});

interface Props {
  currentMishna: iMishna;
  getMishna: Function;
  setMishnaViewOptions: Function;
}
const MishnaPage = (props: Props) => {
  const { currentMishna, getMishna, setMishnaViewOptions } = props;
  const { tractate, chapter, mishna } = useParams<routeObject>();
  const t = useTheme();

  useEffect(() => {
    setMishnaViewOptions();
  }, []);

  useEffect(() => {
    getMishna(tractate, chapter, mishna);
  }, [tractate, chapter, mishna]);

  return (
    <Grid container spacing={2}>
      <Grid
        item
        sx={{
          width: '100%',
          ml: 2,
          paddingTop: '0 !important',
          position: 'sticky',
          top: '4rem',
          zIndex: 100,
          background: t.palette.background.default,
          boxShadow: '0rem 0rem 1rem 2px #0000005e',
        }}>
        <MishnaViewOptions />
      </Grid>
      <Grid item md={8}>
        <Grid container justifyContent="center" item sm={12}>
          <Grid item md={12} mb={2}>
            <MishnaText mishna={mishna} html={getHTMLFromRawContent(currentMishna?.richTextMishna)} />
          </Grid>
        </Grid>
        <MainText lines={currentMishna?.lines} mishna={currentMishna?.mishna} />
      </Grid>
      <Grid item md={4}>
        <ExcerptsSection />
      </Grid>
      <ManuscriptPopup />
    </Grid>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MishnaPage);
