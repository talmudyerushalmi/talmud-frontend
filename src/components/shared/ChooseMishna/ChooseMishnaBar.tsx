import React, { useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';

import { useParams } from 'react-router';
import ChooseMishnaForm from './ChooseMishnaForm';
import { PrintHeader } from '../PrintHeader';
import { routeObject } from '../../../store/reducers/navigationReducer';
import { iLink, iTractate } from '../../../types/types';
import SearchBar from './SearchBar';
import PageService from '../../../services/pageService';
import { useAppDispatch } from '../../../app/hooks';
import { setRoute } from '../../../store/actions/navigationActions';
import { useTranslation } from 'react-i18next';

interface Props {
  allChapterAllowed?: boolean;
  keypressNavigation?: boolean;
  onNavigationUpdated: (nav: iLink) => void;
  onButtonNavigation?: (nav: iLink) => void;
}

const ChooseMishnaBar = ({
  allChapterAllowed = false,
  keypressNavigation = false,
  onNavigationUpdated,
  onButtonNavigation = () => {},
}: Props) => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const { tractate, chapter, mishna, line } = useParams<routeObject>();
  // Derive navigation directly from URL params instead of using state
  const navigation: iLink = {
    tractate: tractate || '',
    chapter: chapter || '',
    mishna: mishna || '',
    lineNumber: line || '',
  };
  const [allTractates, setAllTractates] = useState<iTractate[]>([]);

  useEffect(() => {
    PageService.getAllTractates().then((tractates) => setAllTractates(tractates));
  }, []);

  useEffect(() => {
    if (tractate && chapter && mishna) {
      dispatch(setRoute(tractate, chapter, mishna, line));
    }
  }, [tractate, chapter, mishna, line, dispatch]);

  return (
    <>
      <Box className="choose-mishna-bar-form">
        <Grid container>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <ChooseMishnaForm
              key={`${navigation.tractate}-${navigation.chapter}-${navigation.mishna}-${navigation.lineNumber}`}
              allChapterAllowed
              keypressNavigation
              onNavigationUpdated={onNavigationUpdated}
              onButtonNavigation={onButtonNavigation}
              initValues={navigation}
              allTractates={allTractates}
              isHebrew={isHebrew}
            />
          </Box>
        </Grid>
      </Box>
      <Box sx={{ display: 'flex', width: '100%', flexDirection: isHebrew ? 'row' : 'row-reverse' }}>
        <Box sx={{ marginRight: isHebrew ? 0 : '30px' }}>
          <SearchBar />
        </Box>
        {isHebrew && <Box sx={{ flexGrow: 1 }} />}
      </Box>
      {/* Print version */}
      <PrintHeader allTractates={allTractates} />
    </>
  );
};

export default ChooseMishnaBar;
