import React, { useEffect, useMemo, useState } from 'react';
import { Button, Grid, Box } from '@mui/material';

import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import ChooseMishnaForm from './ChooseMishnaForm';
import { PrintHeader } from '../PrintHeader';
import { routeObject } from '../../../store/reducers/navigationReducer';
import { iLink, iTractate } from '../../../types/types';
import { connect } from 'react-redux';
import { setRoute } from '../../../store/actions/navigationActions';
import PageService from '../../../services/pageService';

interface Props {
  allChapterAllowed?: boolean;
  keypressNavigation?: boolean;
  onNavigationUpdated: Function;
  onButtonNavigation?: (nav: iLink) => void;
  setRoute: (tractate: string, chapter: string, mishna: string, line: string) => void;
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  setRoute: (tractate: string, chapter: string, mishna: string, line: string) => {
    dispatch(setRoute(tractate, chapter, mishna, line));
  },
});

const selectButtonDisabled = () => false;

const ChooseMishnaBar = ({
  allChapterAllowed = false,
  keypressNavigation = false,
  onNavigationUpdated,
  onButtonNavigation = () => {},
  setRoute,
}: Props) => {
  const { tractate, chapter, mishna, line } = useParams<routeObject>();
  const [navigation, setNavigation] = useState<iLink>({
    tractate: tractate || '',
    chapter: chapter || '',
    mishna: mishna || '',
    lineNumber: line || '',
  });
  const { t } = useTranslation();
  const [allTractates, setAllTractates] = useState<iTractate[]>([]);

  useEffect(() => {
    PageService.getAllTractates().then((tractates) => setAllTractates(tractates));
  }, []);

  const handleNavigate = (e) => {
    onNavigationUpdated(navigation);
  };
  const memoizedProps = useMemo(() => {
    const link: iLink = {
      tractate: tractate || '',
      chapter: chapter || '',
      mishna: mishna || '',
      lineNumber: line || '',
    };
    if (tractate && chapter && mishna) {
      setRoute(tractate, chapter, mishna, line || '');
    }
    return {
      initValues: link,
    };
  }, [tractate, chapter, mishna, line]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleNavigate(e);
        }}
        className="choose-mishna-bar-form">
        <Grid container>
          <Box sx={{ display: 'flex', flexGrow: 10 }}>
            <ChooseMishnaForm
              allChapterAllowed
              keypressNavigation
              onNavigationUpdated={(newNav) => {
                setNavigation(newNav);
              }}
              onButtonNavigation={onButtonNavigation}
              {...memoizedProps}
              allTractates={allTractates}
            />
          </Box>
          <Box mb={2} sx={{ display: 'flex', flexGrow: 1 }}>
            <Button
              sx={{ width: '100%' }}
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleNavigate}
              disabled={selectButtonDisabled()}>
              {t('Go')}
            </Button>
          </Box>
        </Grid>
      </form>
      {/* Print version */}
      <PrintHeader allTractates={allTractates} />
    </>
  );
};

export default connect(() => ({}), mapDispatchToProps)(ChooseMishnaBar);
