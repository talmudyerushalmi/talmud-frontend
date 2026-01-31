import React, { useCallback, useEffect, useState } from 'react';
import ChooseTractate from './ChooseTractate';
import { iMishnaForNavigation } from './ChooseMishna';
import { iChapter, iLink, iTractate } from '../../../types/types';
import ChooseLine, { leanLine } from './ChooseLine';
import { Box, IconButton } from '@mui/material';
import { debounce } from 'lodash';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import useKeypress from '../../../hooks/useKeypress';
import { editorInEventPath } from '../../../inc/editorUtils';
import { useTranslation } from 'react-i18next';
import amudDafMapping from '../../../data/amud_daf_mapping.json';
import { useNavigationHandlers } from './useNavigationHandlers';
import { useDafAmudState } from './useDafAmudState';
import ChapterMishnaNavigation from './ChapterMishnaNavigation';
import DafAmudNavigation from './DafAmudNavigation';

const DEBOUNCE_NAVIGATION_CHANGES = 50;

interface Props {
  initValues: iLink | null;
  allChapterAllowed?: boolean;
  keypressNavigation?: boolean;
  onNavigationUpdated: (navigation: iLink) => void;
  navButtons?: boolean;
  onButtonNavigation?: (navigation: iLink) => void;
  allTractates?: iTractate[];
  showDafAmudNavigation?: boolean;
}

const ChooseMishnaForm = ({
  initValues,
  allChapterAllowed,
  keypressNavigation = false,
  navButtons = true,
  onNavigationUpdated,
  onButtonNavigation = (_) => {},
  allTractates,
  showDafAmudNavigation = false,
}: Props) => {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  
  // Main navigation state
  const [tractateName, setTractateName] = useState<string>(initValues?.tractate || '');
  const [chapterName, setChapterName] = useState<string>(initValues?.chapter || '');
  const [mishnaName, setMishnaName] = useState<string>(initValues?.mishna || '');
  const [lineNumber, setLineNumber] = useState<string>(initValues?.lineNumber || '');
  const [tractateData, setTractateData] = useState<iTractate | null>(null);
  const [chapterData, setChapterData] = useState<iChapter | null>(null);
  const [mishnaData, setMishnaData] = useState<iMishnaForNavigation | null>(null);
  const [lineData, setLineData] = useState<leanLine | null>(null);
  
  // Track if we're in the middle of navigation to avoid clearing mishna
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  
  // Daf/Amud state management (extracted to custom hook)
  const {
    dafName,
    setDafName,
    amudName,
    setAmudName,
    dafData,
    setDafData,
  } = useDafAmudState({
    initValues,
    tractateData,
    mishnaData,
  });

  // Navigation handlers (extracted to custom hook)
  const { navigateHandler, navigateDafAmudHandler, Direction } = useNavigationHandlers({
    state: {
      tractateName,
      chapterName,
      mishnaName,
      lineNumber,
      mishnaData,
      tractateData,
      dafName,
      amudName,
    },
    setters: {
      setTractateName,
      setChapterName,
      setMishnaName,
      setLineNumber,
      setTractateData,
      setDafName,
      setAmudName,
      setDafData,
    },
    allTractates,
    onButtonNavigation,
    onNavigationUpdated,
  });

  // Sync state when initValues changes (e.g., after navigation or initial load)
  useEffect(() => {
    if (initValues) {
      let hasChanges = false;
      setIsNavigating(true);
      
      if (initValues.tractate && initValues.tractate !== tractateName) {
        setTractateName(initValues.tractate);
        hasChanges = true;
      }
      if (initValues.chapter && initValues.chapter !== chapterName) {
        setChapterName(initValues.chapter);
        hasChanges = true;
      }
      if (initValues.mishna && initValues.mishna !== mishnaName) {
        setMishnaName(initValues.mishna);
        hasChanges = true;
      }
      if (initValues.lineNumber !== undefined && initValues.lineNumber !== lineNumber) {
        setLineNumber(initValues.lineNumber);
        hasChanges = true;
      }
      
      // Reset navigation flag after a short delay
      if (hasChanges) {
        setTimeout(() => {
          setIsNavigating(false);
        }, 100);
      } else {
        setIsNavigating(false);
      }
    }
  }, [initValues?.tractate, initValues?.chapter, initValues?.mishna, initValues?.lineNumber]);

  // Keyboard navigation
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
              // Reset to first chapter and clear mishna when tractate changes
              if (t.chapters?.length > 0) {
                const firstChapter = t.chapters[0];
                setChapterName(firstChapter.id);
                setChapterData(firstChapter);
                // Clear mishna to show placeholder (only if not navigating)
                if (!isNavigating) {
                  setMishnaName('');
                  setMishnaData(null);
                }
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

        {/* Chapter/Mishna Navigation Section */}
        <ChapterMishnaNavigation
          isHebrew={isHebrew}
          navButtons={navButtons}
          showDafAmudNavigation={showDafAmudNavigation}
          lineNumber={lineNumber}
          chapterName={chapterName}
          mishnaName={mishnaName}
          tractateData={tractateData}
          chapterData={chapterData}
          allChapterAllowed={allChapterAllowed}
          isNavigating={isNavigating}
          setChapterName={setChapterName}
          setChapterData={setChapterData}
          setMishnaName={setMishnaName}
          setMishnaData={setMishnaData}
          onNavigateBack={() => navigateHandler(Direction.BACK)}
          onNavigateForward={() => navigateHandler(Direction.FORWARD)}
          onUserSelectMishna={(m) => {
            // Only emit navigation when user actually clicks
            const link: iLink = {
              tractate: tractateName,
              chapter: chapterName,
              mishna: m.mishna,
              lineNumber: lineNumber,
            };
            emit(link);
          }}
        />

        {/* Daf/Amud Navigation - only show if enabled */}
        {showDafAmudNavigation && (
          <DafAmudNavigation
            isHebrew={isHebrew}
            navButtons={navButtons}
            dafName={dafName}
            amudName={amudName}
            dafData={dafData}
            tractateData={tractateData}
            tractateName={tractateName}
            isNavigating={isNavigating}
            setDafName={setDafName}
            setAmudName={setAmudName}
            setDafData={setDafData}
            setChapterName={setChapterName}
            setMishnaName={setMishnaName}
            setLineNumber={setLineNumber}
            onNavigationUpdated={onNavigationUpdated}
            onNavigateBack={() => navigateDafAmudHandler(Direction.BACK)}
            onNavigateForward={() => navigateDafAmudHandler(Direction.FORWARD)}
          />
        )}

        {/* Line selector with navigation arrows (if needed and Daf/Amud is hidden) */}
        {lineNumber && !showDafAmudNavigation ? (
          <>
            {/* Navigation arrow before line selector */}
            {navButtons ? (
              <IconButton
                onClick={() => {
                  navigateHandler(Direction.BACK);
                }}
                size="small">
                {isHebrew ? <ArrowForward /> : <ArrowBack />}
              </IconButton>
            ) : null}
            
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
            
            {/* Navigation arrow after line selector */}
            {navButtons ? (
              <IconButton
                onClick={() => {
                  navigateHandler(Direction.FORWARD);
                }}
                size="small">
                {isHebrew ? <ArrowBack /> : <ArrowForward />}
              </IconButton>
            ) : null}
          </>
        ) : lineNumber ? (
          // Line selector without arrows (when Daf/Amud is shown)
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
