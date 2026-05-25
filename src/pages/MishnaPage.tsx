import React, { useEffect } from 'react';
import { Grid, useTheme } from '@mui/material';
import MainText from '../components/MishnaView/MainText';
import MishnaText from '../components/MishnaView/MishnaText';
import { connect } from 'react-redux';
import ExcerptsSection from '../components/MishnaView/ExcerptsSection';
import TaggedSidebar from '../components/MishnaView/TaggedSidebar';
import MishnaViewOptions from '../components/MishnaView/MishnaViewOptions';
import SplitPartTabs from '../components/MishnaView/SplitPartTabs';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getHTMLFromRawContent } from '../inc/editorUtils';
import { iMishna, DafAmudMarker } from '../types/types';
import { routeObject } from '../store/reducers/navigationReducer';
import { getMishna } from '../store/actions/navigationActions';
import { setMishnaViewOptions } from '../store/actions/mishnaViewActions';
import { ShowEditType } from '../store/reducers/mishnaViewReducer';
import ManuscriptPopup from '../components/MishnaView/ManuscriptPopup';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchSynopsisList } from '../store/actions/synopsisActions';
import { useStickyOptions } from '../contexts/StickyOptionsContext';
import { useTaggedViewSync } from '../hooks/useTaggedViewSync';

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
  showEditType: state.mishnaView.showEditType,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  setMishnaViewOptions: () => {
    dispatch(setMishnaViewOptions(DEFAULT_OPTIONS));
  },
  getMishna: (tractate: string, chapter: string, mishna: string, part?: number) => {
    dispatch(getMishna(tractate, chapter, mishna, part));
  },
});

interface Props {
  currentMishna: iMishna;
  getMishna: Function;
  setMishnaViewOptions: Function;
  showEditType: ShowEditType;
}

interface LocationState {
  dafAmudMarkers?: DafAmudMarker[];
}

const MishnaPage = (props: Props) => {
  const { currentMishna, getMishna, setMishnaViewOptions, showEditType } = props;
  const { tractate, chapter, mishna } = useParams<routeObject>();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // `?part=N` is consumed only by split halachas; the BE clamps/ignores otherwise.
  const partParam = searchParams.get('part');
  const part = partParam ? Number(partParam) : undefined;
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

  useTaggedViewSync(showEditType, tractate, chapter, mishna);

  useEffect(() => {
    getMishna(tractate, chapter, mishna, part);
    
    // Clear markers only when navigating to a DIFFERENT mishna
    const newMishnaKey = `${tractate}-${chapter}-${mishna}`;
    if (newMishnaKey !== currentMishnaKey && !(location.state as LocationState)?.dafAmudMarkers) {
      setDafAmudMarkers([]);
      setCurrentMishnaKey(newMishnaKey);
    }
  }, [tractate, chapter, mishna, part, getMishna, currentMishnaKey, location.state]);

  // Honor a BE-supplied redirect: e.g. the user navigated to the SECOND source of a unify
  // (`/.../007`) — the BE returns `_redirectTo: { mishna: '006' }` and we move them to the
  // canonical URL. We only redirect when the target differs from current params to avoid
  // any chance of a loop.
  useEffect(() => {
    const r = currentMishna?._redirectTo;
    if (!r) return;
    if (r.tractate === tractate && r.chapter === chapter && r.mishna === mishna) return;
    navigate(`/talmud/${r.tractate}/${r.chapter}/${r.mishna}`, { replace: true });
  }, [currentMishna, tractate, chapter, mishna, navigate]);

  return (
    <Grid container spacing={2} sx={{ marginTop: '-40px' }}>
      <Grid item md={8} className="mishna-text-container" sx={{ paddingTop: '0 !important' }}>
        {currentMishna?._split && (
          <SplitPartTabs
            source={currentMishna._split.source}
            parts={currentMishna._split.parts}
            currentPart={currentMishna._split.currentPart}
          />
        )}
        <Grid container justifyContent="center" item sm={12}>
          <Grid item md={12} mb={2}>
            <MishnaText mishna={mishna} html={getHTMLFromRawContent(currentMishna?.richTextMishna)} />
          </Grid>
        </Grid>
        <MainText lines={currentMishna?.lines} mishna={currentMishna?.mishna} dafAmudMarkers={dafAmudMarkers} />
      </Grid>
      <Grid item md={4} className="excerpts-section" sx={{ paddingTop: '0 !important' }}>
        {showEditType === ShowEditType.TAGGED ? <TaggedSidebar /> : <ExcerptsSection />}
      </Grid>
      <ManuscriptPopup />
    </Grid>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MishnaPage);
