import React, { useEffect } from 'react';
import { Grid, useTheme } from '@mui/material';
import MainText from '../components/MishnaView/MainText';
import MishnaText from '../components/MishnaView/MishnaText';
import { connect } from 'react-redux';
import ExcerptsSection from '../components/MishnaView/ExcerptsSection';
import MishnaViewOptions from '../components/MishnaView/MishnaViewOptions';
import { useParams, useLocation } from 'react-router';
import { getHTMLFromRawContent } from '../inc/editorUtils';
import { iMishna, DafAmudMarker } from '../types/types';
import { routeObject } from '../store/reducers/navigationReducer';
import { getMishna } from '../store/actions/navigationActions';
import { setMishnaViewOptions } from '../store/actions/mishnaViewActions';
import ManuscriptPopup from '../components/MishnaView/ManuscriptPopup';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchSynopsisList } from '../store/actions/synopsisActions';
import { useStickyOptions } from '../contexts/StickyOptionsContext';

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

interface LocationState {
  dafAmudMarkers?: DafAmudMarker[];
}

const MishnaPage = (props: Props) => {
  const { currentMishna, getMishna, setMishnaViewOptions } = props;
  const { tractate, chapter, mishna } = useParams<routeObject>();
  const location = useLocation();
  const t = useTheme();
  const dispatch = useAppDispatch();
  const { setOptionsComponent } = useStickyOptions();
  
  // Store dafAmudMarkers in state to persist across re-renders
  const [dafAmudMarkers, setDafAmudMarkers] = React.useState<DafAmudMarker[]>([]);
  const [currentMishnaKey, setCurrentMishnaKey] = React.useState<string>('');
  
  // Register the options component with the context
  useEffect(() => {
    setOptionsComponent(<MishnaViewOptions />);
  }, [setOptionsComponent]);
  
  // Update markers when location state changes
  React.useEffect(() => {
    const markers = (location.state as LocationState)?.dafAmudMarkers;
    if (markers && markers.length > 0) {
      setDafAmudMarkers(markers);
      setCurrentMishnaKey(`${tractate}-${chapter}-${mishna}`);
    }
  }, [location.state, tractate, chapter, mishna]);
  
  // Fetch synopsis list for SynopsisTable component
  const synopsisLoaded = useAppSelector((state) => state.synopsis.loaded);
  useEffect(() => {
    if (!synopsisLoaded) {
      dispatch(fetchSynopsisList());
    }
  }, [dispatch, synopsisLoaded]);

  useEffect(() => {
    setMishnaViewOptions();
  }, [setMishnaViewOptions]);

  useEffect(() => {
    getMishna(tractate, chapter, mishna);
    
    // Clear markers only when navigating to a DIFFERENT mishna
    const newMishnaKey = `${tractate}-${chapter}-${mishna}`;
    if (newMishnaKey !== currentMishnaKey && !(location.state as LocationState)?.dafAmudMarkers) {
      setDafAmudMarkers([]);
      setCurrentMishnaKey(newMishnaKey);
    }
  }, [tractate, chapter, mishna, getMishna, currentMishnaKey, location.state]);

  return (
    <Grid container spacing={2} sx={{ marginTop: 0 }}>
      <Grid item md={8} className="mishna-text-container" sx={{ paddingTop: '0 !important' }}>
        <Grid container justifyContent="center" item sm={12}>
          <Grid item md={12} mb={2}>
            <MishnaText mishna={mishna} html={getHTMLFromRawContent(currentMishna?.richTextMishna)} />
          </Grid>
        </Grid>
        <MainText lines={currentMishna?.lines} mishna={currentMishna?.mishna} dafAmudMarkers={dafAmudMarkers} />
      </Grid>
      <Grid item md={4} className="excerpts-section" sx={{ paddingTop: '0 !important' }}>
        <ExcerptsSection />
      </Grid>
      <ManuscriptPopup />
    </Grid>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MishnaPage);
