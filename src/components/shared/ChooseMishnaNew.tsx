import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
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
import { iChapter, iLink, iMarker, iMishna, iTractate } from '../../types/types';
import NavigationService from '../../services/NavigationService';
import { leanLine } from './ChooseMishnaBar';
import useNavigationData from '../../hooks/useNavigationData';

// when a component is updated - all those beneathe him should be as well
// for example - tractate updated? need to updated chapter,mishna
//               chapter  updated? need to updated mishna

export interface iMishnaForNavigation extends refMishna {
  lines: leanLine[];
  previous?: iMarker;
  next?: iMarker;
}

const useStyles = makeStyles({
  option: {
    direction: 'rtl',
  },
  root: {
    minWidth: 100,
    flex: 'auto',
    '&.MuiAutocomplete-root  .MuiOutlinedInput-root .MuiAutocomplete-input': {
      padding: 0,
    },
  },
});

export type refMishna = Pick<iMishna, 'id' | 'mishna'>;
export interface leanChapter {
  id: string;
  mishnaiot: refMishna[];
}

export const ALL_CHAPTER = {
  id: 'all',
  mishna: '000',
  mishnaRef: '',
};

export interface iSelectedNavigation {
  selectedTractate: iTractate;
  selectedChapter: leanChapter;
  selectedMishna: iMishnaForNavigation;
  selectedLine: string;
}
interface Props {
  initValues: iLink;
  onNavigationUpdated: (selected: iSelectedNavigation) => void;
}
const ChooseMishnaNew = (props: Props) => {
  const { initValues, onNavigationUpdated } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const [selectedTractate, setSelectedTractate] = useState<iTractate | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<iChapter | null>(null);
  const [selectedMishna, setSelectedMishna] = useState<iMishnaForNavigation | null>(null);
  const [selectedLine, setSelectedLine] = useState<leanLine | null>(null);

  const { allTractates, tractateData, mishnaForNavigation } = useNavigationData(initValues);

  const getMishnaForNavigation = (tractate: string, chapter: string, mishna: string) => {
    const controller = new AbortController();
    return NavigationService.getMishnaForNavigation(tractate, chapter, mishna, controller);
  };

  useEffect(() => {
    // console.log(`%c init values  ${initValues.tractate}  ${initValues.chapter} ${initValues.mishna}`, 'background: #222; color: #bada55');
  }, [initValues]);

  useEffect(() => {
    const chapterData = tractateData?.chapters.find((c) => c.id === initValues.chapter) || null;
    //const mishnaData = chapterData?.mishnaiot.find(m=> m.mishna === initValues.mishna) || null
    const lineData = mishnaForNavigation?.lines.find(l => l.lineNumber === initValues.lineNumber)
    console.log('chapter data is ', chapterData);
    setSelectedTractate(tractateData);
    setSelectedChapter(chapterData);
    setSelectedMishna(mishnaForNavigation);
    if (lineData) {
      setSelectedLine(lineData)
    }
    
  }, [tractateData, mishnaForNavigation]);

  useEffect(() => {
    console.log(
      `%c update mishnaForNavigation  ${mishnaForNavigation?.lines.length}`,
      'background: #222; color: #ffff55'
    );
  }, [mishnaForNavigation]);

  useEffect(() => {
    console.log(`%c need to init component to  ${initValues.tractate}`, 'background: #222; color: #ac0303');
  }, [initValues]);

  useEffect(() => {
    console.log('emit?');
    emit();
  }, [selectedTractate, selectedChapter, selectedMishna]);

  const emit = debounce(() => {
    if (selectedTractate == null || selectedChapter == null || selectedMishna == null) {
      return;
    }
    const navigation: iSelectedNavigation = {
      selectedTractate: selectedTractate,
      selectedChapter: selectedChapter,
      selectedMishna: selectedMishna,
      selectedLine: '',
    };
    onNavigationUpdated(navigation);
  }, 20);

  const changeTractate = (_: any, value: iTractate | null) => {
    // need to update chapter, mishna, and line
    const firstChapter = value!.chapters[0];
    const firstMishna = firstChapter.mishnaiot[0];
    getMishnaForNavigation(value!.id, firstChapter.id, firstMishna.mishna).then((m) => {
      setSelectedTractate(value);
      setSelectedChapter(firstChapter);
      setSelectedMishna(m);
    });
  };
  const changeChapter = (_: any, value: iChapter | null) => {
    const firstMishna = value!.mishnaiot[0];
    getMishnaForNavigation(selectedTractate!.id, value!.id, firstMishna.mishna).then((m) => {
      setSelectedChapter(value);
      setSelectedMishna(m);
    });
  };
  const changeMishna = (_: any, value: iMishnaForNavigation | null) => {
    getMishnaForNavigation(selectedTractate!.id, selectedChapter!.id, value!.mishna).then((m) => {
      setSelectedMishna(m);
    });
  };

  return (
    <>
      <Box mb={2} sx={{ display: 'flex', flexGrow: 10 }}>
        <Autocomplete
          classes={classes}
          onChange={changeTractate}
          value={selectedTractate}
          options={allTractates}
          autoHighlight={true}
          getOptionLabel={(option) => option.title_heb}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => <TextField {...params} label={t('Tractate')} variant="outlined" />}
        />
        <Autocomplete
          classes={classes}
          onChange={changeChapter}
          value={selectedChapter}
          options={selectedTractate?.chapters || []}
          autoHighlight={true}
          getOptionLabel={(option) => hebrewMap.get(parseInt(option.id)) as string}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => <TextField {...params} label={t('Chapter')} variant="outlined" />}
        />
        <Autocomplete
          classes={classes}
          //@ts-ignore
          onChange={changeMishna}
          value={selectedMishna}
          options={selectedChapter?.mishnaiot || []}
          autoHighlight={true}
          getOptionLabel={(option) => hebrewMap.get(parseInt(option.mishna)) as string}
          isOptionEqualToValue={(option, value) => option.mishna === value.mishna}
          renderInput={(params) => <TextField {...params} label={t('Halakha')} variant="outlined" />}
        />
        <Autocomplete
          classes={classes}
          onChange={(e, value) => {
            setSelectedLine(value);
          }}
          value={selectedLine}
          options={selectedMishna ? selectedMishna.lines : []}
          autoHighlight={true}
          getOptionLabel={(option) => option.lineNumber + ' ' + option.mainLine || ''}
          ListboxProps={{
            style: {
              textAlign: 'right',
            },
          }}
          renderInput={(params) => <TextField {...params} label="שורה" variant="outlined" />}
        />
      </Box>
    </>
  );
};

export default ChooseMishnaNew;
