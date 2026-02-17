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
  showDafAmudNavigation?: boolean;
}

const ChooseMishnaBar = ({
  allChapterAllowed = false,
  keypressNavigation = false,
  onNavigationUpdated,
  onButtonNavigation = () => {},
  showDafAmudNavigation = false,
}: Props) => {
  const dispatch = useAppDispatch();
  const { tractate, chapter, mishna, line } = useParams<routeObject>();
  // Derive navigation directly from URL params instead of using state
  // If mishna is undefined but we have chapter (and allChapterAllowed), use 'all' for כל הפרק
  const navigation: iLink = {
    tractate: tractate || '',
    chapter: chapter || '',
    mishna: mishna || (chapter && allChapterAllowed ? 'all' : ''),
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
              showDafAmudNavigation={showDafAmudNavigation}
            />
          </Box>
        </Grid>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        width: '100%',
        'html:lang(he) &': {
          flexDirection: 'row',
        },
        'html:lang(en-US) &': {
          flexDirection: 'row-reverse',
        },
      }}>
        <Box sx={{ 
          'html:lang(he) &': {
            marginRight: 0,
          },
          'html:lang(en-US) &': {
            marginLeft: 'auto',
            marginRight: 0,
          },
        }}>
          <SearchBar />
        </Box>
        <Box sx={{ 
          flexGrow: 1,
          'html:lang(en-US) &': {
            display: 'none',
          },
        }} />
      </Box>
      {/* Print version */}
      <PrintHeader allTractates={allTractates} />
    </>
  );
};

export default ChooseMishnaBar;
