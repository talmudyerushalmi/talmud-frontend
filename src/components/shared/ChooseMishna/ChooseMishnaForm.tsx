import React, { useCallback, useEffect, useState } from 'react';
import ChooseTractate from './ChooseTractate';
import ChooseChapter from './ChooseChapter';
import ChooseMishna, { iMishnaForNavigation } from './ChooseMishna';
import { iChapter, iLink, iTractate } from '../../../types/types';
import ChooseLine, { leanLine } from './ChooseLine';
import { Box, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
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

enum NavigationMode {
  CHAPTER_MISHNA = 'CHAPTER_MISHNA',
  AMUD_DAF = 'AMUD_DAF',
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
  const [navigationMode, setNavigationMode] = useState<NavigationMode>(NavigationMode.CHAPTER_MISHNA);
  const [tractateName, setTractateName] = useState<string>(initValues?.tractate || '');
  const [chapterName, setChapterName] = useState<string>(initValues?.chapter || '');
  const [mishnaName, setMishnaName] = useState<string>(initValues?.mishna || '');
  const [lineNumber, setLineNumber] = useState<string>(initValues?.lineNumber || '');
  const [tractateData, setTractateData] = useState<iTractate | null>(null);
  const [chapterData, setChapterData] = useState<iChapter | null>(null);
  const [mishnaData, setMishnaData] = useState<iMishnaForNavigation | null>(null);
  const [lineData, setLineData] = useState<leanLine | null>(null);
  
  // State for Daf/Amud mode
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

  useEffect(() => {
    // Only emit navigation in Chapter/Mishna mode
    if (navigationMode === NavigationMode.CHAPTER_MISHNA) {
      const link: iLink = {
        tractate: tractateName,
        chapter: chapterName,
        mishna: mishnaName,
        lineNumber: lineNumber,
      };

      emit(link);
    }
  }, [chapterData, mishnaData, lineData, navigationMode]);

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
      {/* Navigation Mode Toggle */}
      <Box mb={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={navigationMode}
          exclusive
          onChange={(e, newMode) => {
            if (newMode !== null) {
              setNavigationMode(newMode);
              // Reset selections when switching modes
              if (newMode === NavigationMode.CHAPTER_MISHNA) {
                // Switching to Chapter/Mishna mode - reset to first chapter/mishna if needed
                if (tractateData && tractateData.chapters && tractateData.chapters.length > 0) {
                  const firstChapter = tractateData.chapters[0];
                  setChapterName(firstChapter.id);
                  setChapterData(firstChapter);
                  if (firstChapter.mishnaiot?.length > 0) {
                    setMishnaName(firstChapter.mishnaiot[0].mishna);
                  }
                }
              } else if (newMode === NavigationMode.AMUD_DAF) {
                // Switching to Daf/Amud mode - reset to first daf/amud if needed
                if (tractateData && tractateData.title_heb) {
                  const tractateMapping = amudDafMapping[tractateData.title_heb as keyof typeof amudDafMapping];
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
            }
          }}
          size="small"
          color="primary"
          sx={{ mb: 1 }}>
          <ToggleButton value={NavigationMode.CHAPTER_MISHNA} aria-label="chapter-halakha">
            {t('Chapter/Halakha')}
          </ToggleButton>
          <ToggleButton value={NavigationMode.AMUD_DAF} aria-label="daf-amud">
            {t('Daf/Amud')}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box mb={2} sx={{ display: 'flex', flexGrow: 10, flexDirection: isHebrew ? 'row' : 'row-reverse' }}>
        {navButtons ? (
          <IconButton
            onClick={() => {
              navigateHandler(Direction.BACK);
            }}
            size="small">
            {isHebrew ? <ArrowForward /> : <ArrowBack />}
          </IconButton>
        ) : null}
        
        <ChooseTractate
          tractate={tractateName}
          allTractates={allTractates}
          onSelectTractate={(t) => {
            const tractateChanged = t.id !== tractateName;
            setTractateName(t.id);
            setTractateData(t);
            
            if (tractateChanged) {
              // Only set defaults based on current navigation mode
              if (navigationMode === NavigationMode.CHAPTER_MISHNA) {
                // Reset to first chapter and first mishna when tractate changes
                if (t.chapters?.length > 0) {
                  const firstChapter = t.chapters[0];
                  setChapterName(firstChapter.id);
                  setChapterData(firstChapter);
                  if (firstChapter.mishnaiot?.length > 0) {
                    setMishnaName(firstChapter.mishnaiot[0].mishna);
                  }
                  setMishnaData(null);
                }
              } else if (navigationMode === NavigationMode.AMUD_DAF) {
                // Set default Daf and Amud for Daf/Amud mode
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
            }
          }}
        />

        {/* Conditional rendering based on navigation mode */}
        {navigationMode === NavigationMode.CHAPTER_MISHNA ? (
          <>
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
            />
            <ChooseMishna
              mishnaName={mishnaName}
              inChapter={chapterData}
              allChapterAllowed={allChapterAllowed}
              onSelectMishna={(m) => {
                setMishnaData(m);
                setMishnaName(m.mishna);
              }}
            />
          </>
        ) : (
          <>
            <ChooseDaf
              daf={dafName}
              inTractate={tractateData?.title_heb || ''}
              onSelectDaf={(d) => {
                setDafName(d.id);
                setDafData(d);
                // Reset amud when daf changes
                setAmudName('');
              }}
            />
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
          </>
        )}

        {lineNumber && navigationMode === NavigationMode.CHAPTER_MISHNA ? (
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
            {isHebrew ? <ArrowBack /> : <ArrowForward />}
          </IconButton>
        ) : null}
      </Box>
    </>
  );
};

export default ChooseMishnaForm;
