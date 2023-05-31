import React, { useEffect, useMemo, useState } from 'react';
import { Button, TextField, Grid, IconButton, Box } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import { Autocomplete } from '@mui/material';
import { requestTractates } from '../../store/actions';
import { connect } from 'react-redux';
import { editorInEventPath } from '../../inc/editorUtils';
import { getNextLine, getPreviousLine, hebrewMap } from '../../inc/utils';
import { useParams } from 'react-router';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { routeObject } from '../../store/reducers/navigationReducer';
import { iMarker, iMishna, iTractate } from '../../types/types';
import NavigationService from '../../services/NavigationService';
import { setRoute } from '../../store/actions/navigationActions';
import ChooseMishnaNew, { iSelectedNavigation } from './ChooseMishna';
import { boolean } from 'yup';

export const ALL_CHAPTER = {
  id: 'all',
  mishna: '000',
  mishnaRef: '',
};

interface Props {
  allChapterAllowed?: boolean;
  onNavigationSelected: Function;
  onNavigationForward?: Function;
  //setRoute: Function;
}

const selectButtonDisabled = () => false;

const ChooseMishnaBar = ({ onNavigationSelected , onNavigationForward = ()=>{}}: Props) => {
  const { tractate, chapter, mishna, line } = useParams<routeObject>();
  const [navigation, setNavigation] = useState<iSelectedNavigation>({
    tractate: tractate || '',
    chapter: chapter || '',
    mishna: mishna || '',
    lineNumber: line || '',
  });
  const { t } = useTranslation();

  const handleNavigate = (e) => {
    console.log('activate navigation to ', navigation);
    //s if (navigation.selectedChapter != )
    onNavigationSelected(navigation);
  };
  const memoizedProps = useMemo(() => {
    const link = {
      tractate: tractate || '',
      chapter: chapter || '',
      mishna: mishna || '',
    };
    return {
      initValues: link,
    };
  }, [tractate, chapter, mishna, line]);

  if (!tractate || !chapter || !mishna) {
    return null;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleNavigate(e);
      }}>
      <Grid container>
        <Box sx={{ display: 'flex', flexGrow: 10 }}>
          <ChooseMishnaNew
            // initValues={link}
            onNavigationUpdated={(newNav) => {

              setNavigation(newNav)
            }}
            onNavigationForward={(navForward) => onNavigationForward(navForward)}
            {...memoizedProps}
          />
          <div>{JSON.stringify(navigation)}</div>
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
  );
};

export default ChooseMishnaBar;
