import * as numeral from 'numeral';
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { TextField, IconButton, Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Autocomplete } from '@mui/material';
import { hebrewMap } from '../../inc/utils';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { routeObject } from '../../store/reducers/navigationReducer';
import { iChapter, iLink, iMarker, iMishna, iTractate } from '../../types/types';
import NavigationService from '../../services/NavigationService';
import useNavigationData from '../../hooks/useNavigationData';

export interface leanLine {
  lineNumber: string;
  mainLine: string;
}

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

export const ALL_CHAPTER: iMishnaForNavigation = {
  id: 'all',
  mishna: '000',
  lines: []
};

export interface iSelectedNavigation {
  tractate: string;
  chapter: string;
  mishna: string;
  lineNumber: string;
}
interface Props {
  initValues: iLink;
  allChapterAllowed?: boolean;
  navButtons?: boolean;
  onNavigationUpdated: (selected: iSelectedNavigation) => void;
  onNavigationForward?: (selected: iSelectedNavigation) => void;
}
const ChooseMishna = ({
  initValues,
  allChapterAllowed,
  navButtons = true,
  onNavigationUpdated,
  onNavigationForward = () => {},
}: Props) => {
  // const { initValues, onNavigationUpdated, navButtons } = props;
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
   // let newTractateData = tractateData?.chapters.push(ALL_CHAPTER)
    let chapter = initValues.chapter || ALL_CHAPTER.id;
    const chapterData = tractateData?.chapters.find((c) => c.id === initValues.chapter) || null;
    const lineData = mishnaForNavigation?.lines.find((l) => l.lineNumber === initValues.lineNumber);
    setSelectedTractate(tractateData);
    setSelectedChapter(chapterData);
    if (initValues.mishna === "" && allChapterAllowed) {
      setSelectedMishna(ALL_CHAPTER);
    } else {
      setSelectedMishna(mishnaForNavigation);
    }
    if (lineData) {
      setSelectedLine(lineData);
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
    emit();
  }, [selectedTractate, selectedChapter, selectedMishna]);

  const emit = debounce(() => {
    if (selectedTractate == null || selectedChapter == null || selectedMishna == null) {
      return;
    }
    const navigation: iSelectedNavigation = {
      tractate: selectedTractate.id,
      chapter: selectedChapter.id,
      mishna: selectedMishna.mishna,
      lineNumber: '',
    };
    onNavigationUpdated(navigation);
  }, 20);

  const onNavigateBack = () => {
    if (selectedMishna?.previous == null || selectedChapter == null || selectedMishna == null) {
      return;
    }
    let prevTractate: iTractate | null;
    let prevChapter: iChapter | null;
    prevTractate = allTractates.find((t) => t.id === selectedMishna.previous?.tractate) || null;
    prevChapter = prevTractate?.chapters.find((c) => c.id === selectedMishna.previous?.chapter) || null;

    if (initValues.lineNumber) {
      const nextLine = numeral(parseInt(selectedLine!.lineNumber) - 1).format('00000');
      const lineObj = selectedMishna?.lines?.find((lineItem) => lineItem.lineNumber === nextLine);
      if (lineObj) {
        setSelectedLine(lineObj);
      } else {
        getMishnaForNavigation(
          selectedMishna.previous.tractate,
          selectedMishna.previous.chapter,
          selectedMishna.previous.mishna
        ).then((m) => {
          setSelectedChapter(prevChapter);
          setSelectedMishna(m);
          setSelectedLine(m.lines[m.lines.length - 1]);
        });
      }
    } else {
      prevTractate = allTractates.find((t) => t.id === selectedMishna.previous?.tractate) || null;
      prevChapter = prevTractate?.chapters.find((c) => c.id === selectedMishna.previous?.chapter) || null;
      getMishnaForNavigation(
        selectedMishna.previous.tractate,
        selectedMishna.previous.chapter,
        selectedMishna.previous.mishna
      ).then((m) => {
        // setSelectedTractate(m.);
        setSelectedChapter(prevChapter);
        setSelectedMishna(m);
        setSelectedLine(m.lines[m.lines.length - 1]);
      });
    }
  };

  const onNavigateForward = () => {
    if (selectedMishna?.next == null || selectedChapter == null || selectedMishna == null) {
      return;
    }
    let nextTractate: iTractate | null;
    let nextChapter: iChapter | null;
    let nextMishna, nextLine;
    nextTractate = allTractates.find((t) => t.id === selectedMishna.next?.tractate) || null;
    nextChapter = nextTractate?.chapters.find((c) => c.id === selectedMishna.next?.chapter) || null;

    if (initValues.lineNumber) {
      const nextLine = numeral(parseInt(selectedLine!.lineNumber) + 1).format('00000');
      const lineObj = selectedMishna?.lines?.find((lineItem) => lineItem.lineNumber === nextLine);
      if (lineObj) {
        setSelectedLine(lineObj);
      } else {
        getMishnaForNavigation(
          selectedMishna.next.tractate,
          selectedMishna.next.chapter,
          selectedMishna.next.mishna
        ).then((m) => {
          setSelectedChapter(nextChapter);
          setSelectedMishna(m);
          setSelectedLine(m.lines[0]);
        });
      }
    } else {
      nextTractate = allTractates.find((t) => t.id === selectedMishna.next?.tractate) || null;
      nextChapter = nextTractate?.chapters.find((c) => c.id === selectedMishna.next?.chapter) || null;
      getMishnaForNavigation(
        selectedMishna.next.tractate,
        selectedMishna.next.chapter,
        selectedMishna.next.mishna
      ).then((m) => {
        // setSelectedTractate(m.);
        setSelectedChapter(nextChapter);
        setSelectedMishna(m);
        setSelectedLine(m.lines[0]);
      });
    }
  };

  // };
  const changeTractate = (_: any, value: iTractate | null) => {
    // need to update chapter, mishna, and line
    const firstChapter = value!.chapters[0];
    const firstMishna = firstChapter.mishnaiot[0];
    getMishnaForNavigation(value!.id, firstChapter.id, firstMishna.mishna).then((m) => {
      setSelectedTractate(value);
      setSelectedChapter(firstChapter);
      setSelectedMishna(m);
      setSelectedLine(m.lines[0]);
    });
  };
  const changeChapter = (_: any, value: iChapter | null) => {
    const firstMishna = value!.mishnaiot[0];
    getMishnaForNavigation(selectedTractate!.id, value!.id, firstMishna.mishna).then((m) => {
      setSelectedChapter(value);
      setSelectedMishna(m);
      setSelectedLine(m.lines[0]);
    });
  };
  const changeMishna = (_: any, value: iMishnaForNavigation | null) => {
    if (value?.id == ALL_CHAPTER.id ) {
      setSelectedMishna(ALL_CHAPTER)
      return
    }
    getMishnaForNavigation(selectedTractate!.id, selectedChapter!.id, value!.mishna).then((m) => {
      setSelectedMishna(m);
      setSelectedLine(m.lines[0]);
    });
  };

  let mishnaOptions
  if (allChapterAllowed) {
    mishnaOptions = selectedChapter?.mishnaiot ? [...selectedChapter?.mishnaiot, ALL_CHAPTER] : [ALL_CHAPTER];
  } else {
    mishnaOptions = selectedChapter?.mishnaiot ? selectedChapter?.mishnaiot : [];
  }

  return (
    <>
      <Box mb={2} sx={{ display: 'flex', flexGrow: 10 }}>
        {navButtons ? (
          <IconButton
            onClick={() => {
              onNavigateBack();
            }}
            size="small">
            <ArrowForward></ArrowForward>
          </IconButton>
        ) : null}
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
          options={mishnaOptions}
          autoHighlight={true}
          getOptionLabel={(option) => hebrewMap.get(parseInt(option.mishna)) as string}
          isOptionEqualToValue={(option, value) => option.mishna === value.mishna}
          renderInput={(params) => <TextField {...params} label={t('Halakha')} variant="outlined" />}
        />
        {initValues.lineNumber ? (
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
        ) : null}
        {navButtons ? (
          <IconButton
            onClick={() => {
              onNavigateForward();
            }}
            size="small">
            <ArrowBack></ArrowBack>
          </IconButton>
        ) : null}
      </Box>
    </>
  );
};

export default ChooseMishna;

export function getNextLine(
  tractate: string,
  chapter: string,
  mishna: string,
  line: string,
  mishnaDoc: iMishnaForNavigation | null
) {
  if (!mishnaDoc) {
    return null;
  }
  const nextLine = numeral(parseInt(line) + 1).format('00000');
  const lineObj = mishnaDoc?.lines?.find((lineItem) => lineItem.lineNumber === nextLine);
  if (lineObj) {
    return {
      tractate,
      chapter,
      mishna,
      line: nextLine,
    };
  } else {
    if (mishnaDoc.next) {
      return {
        ...mishnaDoc.next,
        line: mishnaDoc.next.lineFrom,
      };
    } else return null;
  }
}
