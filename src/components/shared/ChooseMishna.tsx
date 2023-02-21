import { Button, TextField, Grid, IconButton, Box } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import { Autocomplete } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { requestTractates } from '../../store/actions';
import { connect } from 'react-redux';
import { editorInEventPath } from '../../inc/editorUtils';
import { getNextLine, getPreviousLine, hebrewMap } from '../../inc/utils';
import { useParams } from 'react-router';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { routeObject } from '../../store/reducers/navigationReducer';
import { iChapter, iMarker, iMishna, iTractate } from '../../types/types';
import NavigationService from '../../services/NavigationService';
import { leanLine } from './ChooseMishnaBar';

export interface iMishnaForNavigation {
  lines: leanLine[];
  previous?: iMarker;
  next?: iMarker;
}

const mapStateToProps = (state) => ({
  tractates: state.navigation.tractates,
});

const mapDispatchToProps = (dispatch) => ({
  getTractates: () => {
    dispatch(requestTractates());
  },
});

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

export interface leanChapter {
  id: string;
  mishnaiot: Pick<iMishna, 'id' | 'mishna'>[];
}

export const ALL_CHAPTER = {
  id: 'all',
  mishna: '000',
  mishnaRef: '',
};

export interface iSelectedNavigation {
  selectedTractate: iTractate;
  selectedChapter: leanChapter;
  selectedMishna: iMishna;
  selectedLine: string;
}
interface Props {
  tractates: iTractate[];
  getTractates: Function;
  allChapterAllowed?: boolean;
  onNavigationUpdated: (selected: iSelectedNavigation) => void;
}
const ChooseMishna = (props: Props) => {
  const fetchLines = (mishna: string) => {
    const controller = new AbortController();
    return NavigationService.getMishnaForNavigation(selectedTractate?.id, selectedChapter?.id, mishna, controller);
  };
  const { t } = useTranslation();
  const { tractate, chapter, mishna, line } = useParams<routeObject>();
  const classes = useStyles();
  const { tractates, onNavigationUpdated, allChapterAllowed, getTractates } = props;

  const [selectedTractate, setSelectedTractate] = useState<iTractate | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<leanChapter | null>(null);
  const [selectedMishna, setSelectedMishna] = useState<iMishna | null>(null);
  const [mishnaNavigation, setMishnaNavigation] = useState<iMishnaForNavigation | null>(null);

  const [selectedLine, setSelectedLine] = useState<leanLine | null>(null);

  const setNavigation = async (tractate, chapter, mishna, line) => {
    const tractateData = tractates.find((t: iTractate) => t.id === tractate);
    if (tractateData) {
      setSelectedTractate(tractateData);
      const matchChapter = tractateData.chapters.find((c) => c.id === chapter);
      if (matchChapter) {
        setSelectedChapter(matchChapter);
        const matchMishna = matchChapter.mishnaiot.find((m) => m.mishna === mishna);
        if (matchMishna) {
          setSelectedMishna(matchMishna);
          // update lines
          if (line) {
            fetchLines(mishna).then((mishnaForNavigation) => {
              let matchLine = mishnaForNavigation.lines.find((l) => l.lineNumber === line);
              if (matchLine) {
                setSelectedLine(matchLine);
              }
            });
          }
        } else if (mishna === undefined) {
          //@ts-ignore
          setSelectedMishna(ALL_CHAPTER);
        }
      }
    }
  };

  useEffect(() => {
    getTractates();
  }, []);

  useEffect(() => {
    const fetchLines = (mishna: string) => {
      const controller = new AbortController();
      return NavigationService.getMishnaForNavigation(selectedTractate?.id, selectedChapter?.id, mishna, controller);
    };
    if (selectedMishna && selectedMishna.mishna !== ALL_CHAPTER.mishna) {
      const mishna = selectedMishna.mishna;
      fetchLines(mishna)
        .then((mishnaForNavigation) => {
          setMishnaNavigation(mishnaForNavigation);
        })
        // make sure to catch any error
        .catch((error) => {
          console.log('error looking for mishna', error, tractate, chapter, mishna);
        });
    }
  }, [selectedMishna]);

  useEffect(()=>{
    if (selectedMishna){
      setSelectedMishna({...selectedMishna})
    }
  },[
    selectedChapter
  ])


  useEffect(() => {
    setNavigation(tractate, chapter, mishna, line);
  }, [tractate, chapter, mishna, line, tractates]);

  useEffect(() => {
    if (selectedTractate && selectedChapter && selectedMishna && selectedLine) {
      onNavigationUpdated({
        selectedTractate,
        selectedChapter,
        selectedMishna,
        selectedLine: selectedLine.lineNumber,
      });
    }
  }, [selectedTractate, selectedChapter, selectedMishna, selectedLine]);

  const renderMishna = () => {
    let options;
    if (allChapterAllowed) {
      options = selectedChapter?.mishnaiot ? [...selectedChapter?.mishnaiot, ALL_CHAPTER] : [ALL_CHAPTER];
    } else {
      options = selectedChapter?.mishnaiot ? selectedChapter?.mishnaiot : [];
    }
    return (
      <Autocomplete
        classes={classes}
        onChange={(e, value) => {
          //@ts-ignore
          setSelectedMishna(value);
        }}
        value={selectedMishna}
        options={options}
        autoHighlight={true}
        getOptionLabel={(option) => hebrewMap.get(parseInt(option.mishna)) as string}
        isOptionEqualToValue={(option, value) => option.mishna === value.mishna}
        renderInput={(params) => <TextField {...params} label={t('Halakha')} variant="outlined" />}
      />
    );
  };

  const renderLine = () => {
    if (!line) {
      return null;
    }
    return (
      <Autocomplete
        classes={classes}
        onChange={(e, value) => {
          setSelectedLine(value);
        }}
        value={selectedLine}
        options={mishnaNavigation ? mishnaNavigation.lines : []}
        autoHighlight={true}
        getOptionLabel={(option) => option.lineNumber + ' ' + option.mainLine || ''}
        ListboxProps={{
          style: {
            textAlign: 'right',
          },
        }}
        renderInput={(params) => <TextField {...params} label="שורה" variant="outlined" />}
      />
    );
  };

  return (
    <>
      <Box mb={2} sx={{ display: 'flex', flexGrow: 10 }}>
        <Autocomplete
          classes={classes}
          onChange={(e, value) => {
            setSelectedTractate(value);
            const first = value?.chapters[0];
            if (first) {
              setSelectedChapter(first);
            }
          }}
          value={selectedTractate}
          options={tractates || []}
          autoHighlight={true}
          getOptionLabel={(option) => option.title_heb}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => <TextField {...params} label={t('Tractate')} variant="outlined" />}
        />
        <Autocomplete
          classes={classes}
          onChange={(e, value) => {
            setSelectedChapter(value);
          }}
          value={selectedChapter}
          options={selectedTractate?.chapters || []}
          autoHighlight={true}
          getOptionLabel={(option) => hebrewMap.get(parseInt(option.id)) as string}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => <TextField {...params} label={t('Chapter')} variant="outlined" />}
        />
        {renderMishna()}
        {renderLine()}
      </Box>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseMishna);
