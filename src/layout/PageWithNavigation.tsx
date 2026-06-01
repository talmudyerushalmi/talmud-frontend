import { Box, Container } from '@mui/material';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChooseMishnaBar from '../components/shared/ChooseMishna/ChooseMishnaBar';
import Spinner from '../components/shared/Spinner';
import { iLink } from '../types/types';
import { ALL_CHAPTER } from '../components/shared/ChooseMishna/ChooseMishna';
import { StickyOptionsProvider, useStickyOptions } from '../contexts/StickyOptionsContext';

const mapStateToProps = (state) => ({
  loading: state.general.loading,
});

export const PageHeader = (props) => {
  return (
    <Box width="100%" mb={3}>
      {props.children}
    </Box>
  );
};

export const PageContent = (props) => {
  return <Box width="100%">{props.children}</Box>;
};

interface Props {
  linkPrefix: string;
  children: any;
  afterNavigateHandler?: Function;
  allChapterAllowed?: boolean;
  showDafAmudNavigation?: boolean;
  stickyNavigation?: boolean;
  showSearchBar?: boolean;
  loading: boolean;
  /**
   * When true, the bundled `ChooseMishnaBar` lists each underlying source halacha
   * individually (no override merging). Admin pages set this so editors can pick ב or ג
   * directly even when ב-ג is unified.
   */
  raw?: boolean;
}

const PageWithNavigationContent = (props: Props) => {
  const { linkPrefix, allChapterAllowed, showDafAmudNavigation = false, stickyNavigation = true, showSearchBar = true, raw = false, afterNavigateHandler, loading } = props;
  const { optionsComponent } = useStickyOptions();

  const navigate = useNavigate();
  let url: string;
  const navigationSelectedHandler = (link: iLink) => {
    if (link && link.lineNumber) {
      url = `${linkPrefix}/${link.tractate}/${link.chapter}/${link.mishna}/${link.lineNumber}`;
    } else if (link.mishna === ALL_CHAPTER.mishna) {
      url = `${linkPrefix}/${link.tractate}/${link.chapter}`;
    } else {
      url = `${linkPrefix}/${link.tractate}/${link.chapter}/${link.mishna}`;
    }
    // Pass dafAmudMarkers through navigation state if present
    navigate(url, { state: { dafAmudMarkers: link.dafAmudMarkers } });
    if (afterNavigateHandler) {
      afterNavigateHandler();
    }
  };

  return (
    <Container style={{ paddingBottom: '3rem' }}>
      <ChooseMishnaBar
        allChapterAllowed={allChapterAllowed}
        keypressNavigation={true}
        onButtonNavigation={navigationSelectedHandler}
        onNavigationUpdated={navigationSelectedHandler}
        showDafAmudNavigation={showDafAmudNavigation}
        stickyNavigation={stickyNavigation}
        shouldShowOptions={true}
        optionsComponent={optionsComponent}
        showSearchBar={showSearchBar}
        raw={raw}
      />
      <Box
        sx={{
          opacity: loading ? 0.3 : 1,
        }}>
        {loading && <Spinner />}
        {props.children}
      </Box>
    </Container>
  );
};

const PageWithNavigationWithoutState = (props: Props) => {
  return (
    <StickyOptionsProvider>
      <PageWithNavigationContent {...props} />
    </StickyOptionsProvider>
  );
};

const PageWithNavigation = connect(mapStateToProps)(PageWithNavigationWithoutState);
export { PageWithNavigation };
