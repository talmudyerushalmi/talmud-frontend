import React, { useEffect, useState } from 'react';
import { Button, Grid, Box } from '@mui/material';

import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import ChooseMishnaForm from './ChooseMishnaForm';
import { PrintHeader } from '../PrintHeader';
import { routeObject } from '../../../store/reducers/navigationReducer';
import { iLink, iTractate } from '../../../types/types';
import SearchBar from './SearchBar';
import PageService from '../../../services/pageService';
import { useAppDispatch } from '../../../app/hooks';
import { setRoute } from '../../../store/actions/navigationActions';

interface Props {
  allChapterAllowed?: boolean;
  keypressNavigation?: boolean;
  onNavigationUpdated: Function;
  onButtonNavigation?: (nav: iLink) => void;
}

const selectButtonDisabled = () => false;

const ChooseMishnaBar = ({
  allChapterAllowed = false,
  keypressNavigation = false,
  onNavigationUpdated,
  onButtonNavigation = () => {},
}: Props) => {
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    if (navigation.tractate && navigation.chapter && navigation.mishna) {
      dispatch(setRoute(navigation.tractate, navigation.chapter, navigation.mishna, navigation.lineNumber));
    }
  }, [navigation, dispatch]);

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
              initValues={navigation}
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
      <SearchBar />
      {/* Print version */}
      <PrintHeader allTractates={allTractates} />
    </>
  );
};

export default ChooseMishnaBar;
