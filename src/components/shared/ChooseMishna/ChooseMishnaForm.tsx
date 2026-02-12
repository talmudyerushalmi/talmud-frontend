import React, { useCallback, useEffect, useState } from 'react';
import ChooseTractate from './ChooseTractate';
import { iMishnaForNavigation } from './ChooseMishna';
import { iChapter, iLink, iTractate } from '../../../types/types';
import ChooseLine, { leanLine } from './ChooseLine';
import { Box } from '@mui/material';
import { debounce } from 'lodash';
import useKeypress from '../../../hooks/useKeypress';
import { editorInEventPath } from '../../../inc/editorUtils';
import { useDafAmudState } from './useDafAmudState';
import { getAllDafsForTractate } from '../../../services/dafAmudService';
import { useChapterMishnaNavigation } from './useChapterMishnaNavigation';
import { useDafAmudNavigation } from './useDafAmudNavigation';
import ChapterMishnaNavigation from './ChapterMishnaNavigation';
import DafAmudNavigation from './DafAmudNavigation';
import NavigationArrow from './NavigationArrow';
import { useIsHebrew, Direction } from './navigationTypes';

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
  const isHebrew = useIsHebrew();
  
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

  // Chapter/Mishna navigation
  const { navigateHandler } = useChapterMishnaNavigation({
    tractateName,
    chapterName,
    mishnaName,
    lineNumber,
    mishnaData,
    allTractates,
    setTractateName,
    setChapterName,
    setMishnaName,
    setLineNumber,
    onButtonNavigation,
  });

  // Daf/Amud navigation
  const { navigateDafAmudHandler } = useDafAmudNavigation({
    tractateName,
    tractateData,
    dafName,
    amudName,
    allTractates,
    setTractateName,
    setTractateData,
    setDafName,
    setAmudName,
    setDafData,
    setChapterName,
    setMishnaName,
    setLineNumber,
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

  // Helper function to create navigation link object
  const createNavigationLink = useCallback((overrides?: Partial<iLink>): iLink => {
    return {
      tractate: tractateName,
      chapter: chapterName,
      mishna: mishnaName,
      lineNumber: lineNumber,
      ...overrides,
    };
  }, [tractateName, chapterName, mishnaName, lineNumber]);

  // Helper function to emit navigation - only call this when user makes a selection
  const emitNavigation = useCallback(() => {
    emit(createNavigationLink());
  }, [createNavigationLink, emit]);

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
                getAllDafsForTractate(t.title_heb).then((dafList) => {
                  if (dafList.length > 0) {
                    const firstDaf = dafList[0];
                    setDafName(firstDaf.id);
                    setDafData(firstDaf);
                    if (firstDaf.amudim.length > 0) {
                      setAmudName(firstDaf.amudim[0]);
                    }
                  }
                });
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
            emit(createNavigationLink({ mishna: m.mishna }));
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
            {navButtons && (
              <NavigationArrow 
                direction="back" 
                isHebrew={isHebrew} 
                onClick={() => navigateHandler(Direction.BACK)} 
              />
            )}
            
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
            {navButtons && (
              <NavigationArrow 
                direction="forward" 
                isHebrew={isHebrew} 
                onClick={() => navigateHandler(Direction.FORWARD)} 
              />
            )}
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
