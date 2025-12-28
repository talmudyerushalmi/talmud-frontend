import React, { useCallback, useEffect, useState } from 'react';
import ChooseTractate from './ChooseTractate';
import ChooseChapter from './ChooseChapter';
import ChooseMishna, { iMishnaForNavigation } from './ChooseMishna';
import { iChapter, iLink, iTractate } from '../../../types/types';
import ChooseLine, { leanLine } from './ChooseLine';
import { Box, IconButton } from '@mui/material';
import { debounce } from 'lodash';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { getNext, getPrevious } from '../../../inc/utils';
import useKeypress from '../../../hooks/useKeypress';
import { editorInEventPath } from '../../../inc/editorUtils';
import { useTranslation } from 'react-i18next';

const DEBOUNCE_NAVIGATION_CHANGES = 50;

enum Direction {
  BACK = 'BACK',
  FORWARD = 'FORWARD',
}
interface Props {
  initValues: iLink | null;
  allChapterAllowed?: boolean;
  keypressNavigation?: boolean;
  onNavigationUpdated: (navigation: iLink) => void;
  navButtons?: boolean;
  onButtonNavigation?: (navigation: iLink) => void;
  allTractates?: iTractate[];
}

const ChooseMishnaForm = ({
  initValues,
  allChapterAllowed,
  keypressNavigation = false,
  navButtons = true,
  onNavigationUpdated,
  onButtonNavigation = (_) => {},
  allTractates,
}: Props) => {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const [tractateName, setTractateName] = useState<string>(initValues?.tractate || '');
  const [chapterName, setChapterName] = useState<string>(initValues?.chapter || '');
  const [mishnaName, setMishnaName] = useState<string>(initValues?.mishna || '');
  const [lineNumber, setLineNumber] = useState<string>(initValues?.lineNumber || '');
  const [tractateData, setTractateData] = useState<iTractate | null>(null);
  const [chapterData, setChapterData] = useState<iChapter | null>(null);
  const [mishnaData, setMishnaData] = useState<iMishnaForNavigation | null>(null);
  const [lineData, setLineData] = useState<leanLine | null>(null);

  const dialogPopupOpen = () => {
    return document.querySelector('.MuiDialog-root') !== null;
  };
  useKeypress('ArrowLeft', (e: KeyboardEvent) => {
    if (keypressNavigation && !editorInEventPath(e) && !dialogPopupOpen()) {
      navigateHandler(Direction.FORWARD);
    }
  });
  useKeypress('ArrowRight', (e: KeyboardEvent) => {
    if (keypressNavigation && !editorInEventPath(e) && !dialogPopupOpen()) {
      navigateHandler(Direction.BACK);
    }
  });

  const emit = useCallback(
    debounce((link) => {
      onNavigationUpdated(link);
    }, DEBOUNCE_NAVIGATION_CHANGES),
    []
  );

  useEffect(() => {
    const link: iLink = {
      tractate: tractateName,
      chapter: chapterName,
      mishna: mishnaName,
      lineNumber: lineNumber,
    };

    emit(link);
  }, [chapterData, mishnaData, lineData]);

  const navigateHandler = (direction: Direction) => {
    const navigateTo =
      direction === Direction.BACK
        ? getPrevious(tractateName, chapterName, mishnaName, lineNumber, mishnaData)
        : getNext(tractateName, chapterName, mishnaName, lineNumber, mishnaData);
    if (!navigateTo) {
      return;
    }
    setChapterName(navigateTo.chapter);
    setMishnaName(navigateTo.mishna);
    if (navigateTo.lineNumber) {
      setLineNumber(navigateTo.lineNumber);
    }
    onButtonNavigation({
      tractate: tractateName,
      chapter: navigateTo.chapter,
      mishna: navigateTo.mishna,
      lineNumber: navigateTo.lineNumber,
    });
  };

  return (
    <>
      <Box mb={2} sx={{ display: 'flex', flexGrow: 10 }}>
        {navButtons ? (
          <IconButton
            onClick={() => {
              navigateHandler(Direction.BACK);
            }}
            size="small">
            <ArrowForward></ArrowForward>
          </IconButton>
        ) : null}
        <ChooseTractate
          tractate={tractateName}
          allTractates={allTractates}
          isHebrew={isHebrew}
          onSelectTractate={(t) => {
            const tractateChanged = t.id !== tractateName;
            setTractateName(t.id);
            setTractateData(t);
            // Reset to first chapter and first mishna when tractate changes
            if (tractateChanged && t.chapters?.length > 0) {
              const firstChapter = t.chapters[0];
              setChapterName(firstChapter.id);
              setChapterData(firstChapter);
              if (firstChapter.mishnaiot?.length > 0) {
                setMishnaName(firstChapter.mishnaiot[0].mishna);
              }
              setMishnaData(null);
            }
          }}
        />
        <ChooseChapter
          chapter={chapterName}
          inTractate={tractateData}
          isHebrew={isHebrew}
          onSelectChapter={(c) => {
            const chapterChanged = c.id !== chapterName;
            setChapterName(c.id);
            setChapterData(c);
            // Reset to first mishna when chapter changes
            if (chapterChanged && c.mishnaiot?.length > 0) {
              setMishnaName(c.mishnaiot[0].mishna);
              setMishnaData(null);
            }
          }}
        />
        <ChooseMishna
          mishnaName={mishnaName}
          inChapter={chapterData}
          allChapterAllowed={allChapterAllowed}
          isHebrew={isHebrew}
          onSelectMishna={(m) => {
            setMishnaData(m);
            setMishnaName(m.mishna);
          }}
        />

        {lineNumber ? (
          <ChooseLine
            lineNumber={lineNumber}
            mishnaData={mishnaData}
            onSelectLine={(l) => {
              setLineNumber(l.lineNumber);
              setLineData(l);
            }}
          />
        ) : null}

        {navButtons ? (
          <IconButton
            onClick={() => {
              navigateHandler(Direction.FORWARD);
            }}
            size="small">
            <ArrowBack></ArrowBack>
          </IconButton>
        ) : null}
      </Box>
    </>
  );
};

export default ChooseMishnaForm;
