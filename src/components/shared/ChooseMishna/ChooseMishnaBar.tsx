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
  stickyNavigation?: boolean;
}

const ChooseMishnaBar = ({
  allChapterAllowed = false,
  keypressNavigation = false,
  onNavigationUpdated,
  onButtonNavigation = () => {},
  showDafAmudNavigation = false,
  stickyNavigation = false,
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
      {/* Navigation Form - conditionally sticky */}
      <Box 
        className="choose-mishna-bar-form"
        sx={{
          ...(stickyNavigation && {
            position: 'sticky',
            top: '72px', // AppBar height + spacing
            zIndex: 1100,
            backgroundColor: 'background.default',
            paddingLeft: 0.1,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }),
          paddingTop: 1,
          paddingBottom: 1,
          marginBottom: 2,
          '@media print': {
            position: 'static',
            borderBottom: 'none',
            paddingRight: 0,
          },
        }}
      >
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
      
      {/* Search Bar - NOT sticky */}
      <Box sx={{ 
        display: 'flex', 
        width: '100%',
        marginBottom: 2,
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
