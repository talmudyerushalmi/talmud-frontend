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
import ChooseDaf, { leanDaf } from './ChooseDaf';
import ChooseAmud from './ChooseAmud';
import amudDafMapping from '../../../data/amud_daf_mapping.json';

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
  const { i18n, t } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const [tractateName, setTractateName] = useState<string>(initValues?.tractate || '');
  const [chapterName, setChapterName] = useState<string>(initValues?.chapter || '');
  const [mishnaName, setMishnaName] = useState<string>(initValues?.mishna || '');
  const [lineNumber, setLineNumber] = useState<string>(initValues?.lineNumber || '');
  const [tractateData, setTractateData] = useState<iTractate | null>(null);
  const [chapterData, setChapterData] = useState<iChapter | null>(null);
  const [mishnaData, setMishnaData] = useState<iMishnaForNavigation | null>(null);
  const [lineData, setLineData] = useState<leanLine | null>(null);
  
  // State for Daf/Amud
  const [dafName, setDafName] = useState<string>('');
  const [amudName, setAmudName] = useState<string>('');
  const [dafData, setDafData] = useState<leanDaf | null>(null);

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

  // Helper function to emit navigation - only call this when user makes a selection
  const emitNavigation = useCallback(() => {
    const link: iLink = {
      tractate: tractateName,
      chapter: chapterName,
      mishna: mishnaName,
      lineNumber: lineNumber,
    };
    emit(link);
  }, [tractateName, chapterName, mishnaName, lineNumber, emit]);

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
      <Box mb={2} sx={{ display: 'flex', flexGrow: 10, flexDirection: isHebrew ? 'row' : 'row-reverse', alignItems: 'center', gap: 0.5 }}>
        {/* Tractate selector - shared by both navigation methods */}
        <ChooseTractate
          tractate={tractateName}
          allTractates={allTractates}
          onSelectTractate={(t) => {
            const tractateChanged = t.id !== tractateName;
            setTractateName(t.id);
            setTractateData(t);
            
            if (tractateChanged) {
              // Reset to first chapter and first mishna when tractate changes
              // DON'T emit navigation - just update the dropdowns
              if (t.chapters?.length > 0) {
                const firstChapter = t.chapters[0];
                setChapterName(firstChapter.id);
                setChapterData(firstChapter);
                if (firstChapter.mishnaiot?.length > 0) {
                  setMishnaName(firstChapter.mishnaiot[0].mishna);
                }
                setMishnaData(null);
              }
              
              // Also reset Daf/Amud to first available
              if (t.title_heb) {
                const tractateMapping = amudDafMapping[t.title_heb as keyof typeof amudDafMapping];
                if (tractateMapping) {
                  const firstDafKey = Object.keys(tractateMapping)[0];
                  if (firstDafKey) {
                    const firstDafData = tractateMapping[firstDafKey as keyof typeof tractateMapping];
                    const firstAmudKey = Object.keys(firstDafData)[0];
                    
                    setDafName(firstDafKey);
                    setDafData({
                      id: firstDafKey,
                      amudim: Object.keys(firstDafData),
                    });
                    setAmudName(firstAmudKey);
                  }
                }
              }
            }
          }}
        />

        {/* Navigation arrows for Chapter/Halakha */}
        {navButtons ? (
          <IconButton
            onClick={() => {
              navigateHandler(Direction.BACK);
            }}
            size="small">
            {isHebrew ? <ArrowForward /> : <ArrowBack />}
          </IconButton>
        ) : null}

        {/* Chapter selector */}
        <ChooseChapter
          chapter={chapterName}
          inTractate={tractateData}
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
          onUserSelectChapter={(c) => {
            // Chapter selection updates Halakha dropdown but doesn't navigate
            // Navigation only happens when user selects a Halakha
          }}
        />

        {/* Halakha (Mishna) selector */}
        <ChooseMishna
          mishnaName={mishnaName}
          inChapter={chapterData}
          allChapterAllowed={allChapterAllowed}
          onSelectMishna={(m) => {
            setMishnaData(m);
            setMishnaName(m.mishna);
          }}
          onUserSelectMishna={(m) => {
            // Only emit navigation when user actually clicks
            setTimeout(() => emitNavigation(), 10);
          }}
        />

        {/* Navigation arrows for Chapter/Halakha */}
        {navButtons ? (
          <IconButton
            onClick={() => {
              navigateHandler(Direction.FORWARD);
            }}
            size="small">
            {isHebrew ? <ArrowBack /> : <ArrowForward />}
          </IconButton>
        ) : null}

        {/* Separator or space */}
        <Box sx={{ width: '8px' }} />

        {/* Navigation arrows for Daf/Amud */}
        {navButtons ? (
          <IconButton
            onClick={() => {
              // TODO: Implement Daf/Amud navigation
            }}
            size="small">
            {isHebrew ? <ArrowForward /> : <ArrowBack />}
          </IconButton>
        ) : null}

        {/* Daf selector */}
        <ChooseDaf
          daf={dafName}
          inTractate={tractateData?.title_heb || ''}
          onSelectDaf={(d) => {
            setDafName(d.id);
            setDafData(d);
            // Reset amud when daf changes
            if (d.amudim && d.amudim.length > 0) {
              setAmudName(d.amudim[0]);
            }
          }}
        />

        {/* Amud selector */}
        <ChooseAmud
          amud={amudName}
          inDaf={dafData}
          inTractate={tractateData?.title_heb || ''}
          onSelectAmud={(amud, mapping) => {
            setAmudName(amud);
            // Navigate to the mapped chapter/halacha (mishna level only)
            setChapterName(mapping.chapter);
            setMishnaName(mapping.halacha);
            // Clear line number to navigate to mishna level only
            setLineNumber('');
            
            // Trigger navigation to mishna level with Daf/Amud marker info
            onNavigationUpdated({
              tractate: tractateName,
              chapter: mapping.chapter,
              mishna: mapping.halacha,
              lineNumber: '',
              dafAmudMarkers: [{
                line: mapping.line,
                word_pos: mapping.word_pos,
                daf: dafName,
                amud: amud,
              }],
            });
          }}
        />

        {/* Navigation arrows for Daf/Amud */}
        {navButtons ? (
          <IconButton
            onClick={() => {
              // TODO: Implement Daf/Amud navigation
            }}
            size="small">
            {isHebrew ? <ArrowBack /> : <ArrowForward />}
          </IconButton>
        ) : null}

        {/* Line selector (if needed) */}
        {lineNumber ? (
          <ChooseLine
            lineNumber={lineNumber}
            mishnaData={mishnaData}
            onSelectLine={(l) => {
              setLineNumber(l.lineNumber);
              setLineData(l);
              // Emit navigation when user selects line
              setTimeout(() => emitNavigation(), 10);
            }}
          />
        ) : null}
      </Box>
    </>
  );
};

export default ChooseMishnaForm;
