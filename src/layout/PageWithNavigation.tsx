import { Box, Container } from '@mui/material';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ChooseMishnaBar, { ALL_CHAPTER } from '../components/shared/ChooseMishnaBar';
import Spinner from '../components/shared/Spinner';

const mapStateToProps = (state) => ({
  loading: state.general.loading,
});

export const PageHeader = (props) => {
  return <Box  width="100%" mb={3}>
      {props.children}</Box>
};

export const PageContent = (props) => {
  return <Box width="100%">{props.children}</Box>;
};

interface iLink {
  tractate: string;
  chapter: string;
  mishna: string;
  line: string;
}
interface Props {
  linkPrefix: string;
  children: any;
  afterNavigateHandler?: Function;
  allChapterAllowed?: boolean;
  loading: boolean;
}
const PageWithNavigationWithoutState = (props: Props) => {
  const { linkPrefix, allChapterAllowed, afterNavigateHandler, loading } = props;

  const history = useHistory();
  let url: string;
  const navigationSelectedHandler = (link: iLink) => {
    if (link && link.line) {
      url = `${linkPrefix}/${link.tractate}/${link.chapter}/${link.mishna}/${link.line}`;
    } else if (link.mishna === ALL_CHAPTER.mishna) {
      url = `${linkPrefix}/${link.tractate}/${link.chapter}`;
    } else {
      url = `${linkPrefix}/${link.tractate}/${link.chapter}/${link.mishna}`;
    }
    history.push(url);
    if (afterNavigateHandler) {
      afterNavigateHandler();
    }
  };

  return (
    <Container style={{ paddingBottom: '6rem' }}>
      <Box mb={3}>
        <ChooseMishnaBar allChapterAllowed={allChapterAllowed} onNavigationSelected={navigationSelectedHandler} />
      </Box>
      <Box   
        sx={{
          opacity: loading ? 0.3 : 1,
        }}
      >
        {loading && <Spinner />}
        {props.children}
      </Box>
    </Container>
  );
};

const PageWithNavigation = connect(mapStateToProps)(PageWithNavigationWithoutState);
export { PageWithNavigation };
