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
  showDafAmudNavigation?: boolean; // Control whether to show Daf/Amud navigation
}

const ChooseMishnaForm = ({
  initValues,
  allChapterAllowed,
  keypressNavigation = false,
  navButtons = true,
  onNavigationUpdated,
  onButtonNavigation = (_) => {},
  allTractates,
  showDafAmudNavigation = false, // Default to false
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
  
  // Track if we're in the middle of navigation to avoid clearing mishna
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  
  // State for Daf/Amud - try to restore from sessionStorage or initValues
  const [dafName, setDafName] = useState<string>(() => {
    const fromInit = initValues?.dafAmudMarkers?.[0]?.daf;
    if (fromInit) return fromInit;
    const fromStorage = sessionStorage.getItem('selectedDaf');
    return fromStorage || '';
  });
  
  const [amudName, setAmudName] = useState<string>(() => {
    const fromInit = initValues?.dafAmudMarkers?.[0]?.amud;
    if (fromInit) return fromInit;
    const fromStorage = sessionStorage.getItem('selectedAmud');
    return fromStorage || '';
  });
  
  const [dafData, setDafData] = useState<leanDaf | null>(null);

  // Save daf/amud to sessionStorage whenever they change
  useEffect(() => {
    if (dafName) {
      sessionStorage.setItem('selectedDaf', dafName);
    }
  }, [dafName]);

  useEffect(() => {
    if (amudName) {
      sessionStorage.setItem('selectedAmud', amudName);
    }
  }, [amudName]);

  // Restore dafData when tractateData loads and we have dafName
  useEffect(() => {
    if (dafName && tractateData?.title_heb && !dafData) {
      const tractateMapping = amudDafMapping[tractateData.title_heb as keyof typeof amudDafMapping];
      if (tractateMapping && tractateMapping[dafName as keyof typeof tractateMapping]) {
        const dafDataFromMapping = tractateMapping[dafName as keyof typeof tractateMapping];
        const newDafData = {
          id: dafName,
          amudim: Object.keys(dafDataFromMapping),
        };
        setDafData(newDafData);
      }
    }
  }, [tractateData, dafName, dafData]);

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

  // Sync Daf/Amud when mishnaData changes (reverse sync from Chapter/Mishna to Daf/Amud)
  useEffect(() => {
    if (mishnaData && mishnaData.daf && mishnaData.amud && tractateData?.title_heb) {
      const newDaf = mishnaData.daf;
      const newAmud = mishnaData.amud;
      
      // Only update if different from current values
      if (newDaf !== dafName || newAmud !== amudName) {
        setDafName(newDaf);
        setAmudName(newAmud);
        
        // Update dafData for the amud dropdown
        const tractateMapping = amudDafMapping[tractateData.title_heb as keyof typeof amudDafMapping];
        if (tractateMapping && tractateMapping[newDaf as keyof typeof tractateMapping]) {
          const dafDataFromMapping = tractateMapping[newDaf as keyof typeof tractateMapping];
          setDafData({
            id: newDaf,
            amudim: Object.keys(dafDataFromMapping),
          });
        }
      }
    }
  }, [mishnaData, tractateData]);

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

  const navigateDafAmudHandler = (direction: Direction) => {
    if (!tractateData?.title_heb || !dafName || !amudName) {
      return;
    }

    const tractateMapping = amudDafMapping[tractateData.title_heb as keyof typeof amudDafMapping];
    if (!tractateMapping) {
      return;
    }

    // Get all dafim (pages) in order
    const allDafim = Object.keys(tractateMapping);
    const currentDafIndex = allDafim.indexOf(dafName);
    
    if (currentDafIndex === -1) {
      return;
    }

    const currentDafData = tractateMapping[dafName as keyof typeof tractateMapping];
    const amudim = Object.keys(currentDafData);
    const currentAmudIndex = amudim.indexOf(amudName);

    let nextDaf = dafName;
    let nextAmud = amudName;

    if (direction === Direction.FORWARD) {
      // Try next amud in current daf
      if (currentAmudIndex < amudim.length - 1) {
        nextAmud = amudim[currentAmudIndex + 1];
      } else {
        // Go to first amud of next daf
        if (currentDafIndex < allDafim.length - 1) {
          nextDaf = allDafim[currentDafIndex + 1];
          const nextDafData = tractateMapping[nextDaf as keyof typeof tractateMapping];
          const nextAmudim = Object.keys(nextDafData);
          nextAmud = nextAmudim[0];
        } else {
          return; // Already at last amud of last daf
        }
      }
    } else {
      // Try previous amud in current daf
      if (currentAmudIndex > 0) {
        nextAmud = amudim[currentAmudIndex - 1];
      } else {
        // Go to last amud of previous daf
        if (currentDafIndex > 0) {
          nextDaf = allDafim[currentDafIndex - 1];
          const prevDafData = tractateMapping[nextDaf as keyof typeof tractateMapping];
          const prevAmudim = Object.keys(prevDafData);
          nextAmud = prevAmudim[prevAmudim.length - 1];
        } else {
          return; // Already at first amud of first daf
        }
      }
    }

    // Get mapping for the new daf/amud
    const newDafData = tractateMapping[nextDaf as keyof typeof tractateMapping];
    const amudData = newDafData[nextAmud as keyof typeof newDafData] as any;

    if (amudData && typeof amudData === 'object') {
      // Update state
      setDafName(nextDaf);
      setAmudName(nextAmud);
      setDafData({
        id: nextDaf,
        amudim: Object.keys(newDafData),
      });

      // Navigate to the mapped chapter/halacha
      setChapterName(amudData.chapter);
      setMishnaName(amudData.halacha);
      setLineNumber('');

      // Trigger navigation
      onNavigationUpdated({
        tractate: tractateName,
        chapter: amudData.chapter,
        mishna: amudData.halacha,
        lineNumber: '',
        dafAmudMarkers: [{
          line: amudData.system_line,
          word_pos: amudData.word_pos,
          daf: nextDaf,
          amud: nextAmud,
        }],
      });
    }
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
              // Reset to first chapter and clear mishna when tractate changes
              // DON'T emit navigation - just update the dropdowns
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

        {/* Navigation arrows for Chapter/Halakha - left arrow */}
        {navButtons && (showDafAmudNavigation || !lineNumber) ? (
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
            // Clear mishna selection only if this is NOT a navigation update
            if (chapterChanged && !isNavigating) {
              setMishnaName('');
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
            // Pass the mishna directly instead of relying on state
            const link: iLink = {
              tractate: tractateName,
              chapter: chapterName,
              mishna: m.mishna,  // Use the mishna from the callback parameter
              lineNumber: lineNumber,
            };
            emit(link);
          }}
        />

        {/* Navigation arrows for Chapter/Halakha - only show if:
            - No line selector at all, OR
            - Daf/Amud navigation is enabled (regardless of line selector) */}
        {navButtons && (showDafAmudNavigation || !lineNumber) ? (
          <IconButton
            onClick={() => {
              navigateHandler(Direction.FORWARD);
            }}
            size="small">
            {isHebrew ? <ArrowBack /> : <ArrowForward />}
          </IconButton>
        ) : null}

        {/* Daf/Amud Navigation - only show if enabled */}
        {showDafAmudNavigation && (
          <>
            {/* Separator or space */}
            <Box sx={{ width: '8px' }} />

            {/* Navigation arrows for Daf/Amud */}
            {navButtons ? (
              <IconButton
                onClick={() => {
                  navigateDafAmudHandler(Direction.BACK);
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
                const dafChanged = d.id !== dafName;
                setDafName(d.id);
                setDafData(d);
                // Clear amud when daf changes (only if not navigating)
                if (dafChanged && !isNavigating) {
                  setAmudName('');
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
                    line: mapping.system_line,
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
                  navigateDafAmudHandler(Direction.FORWARD);
                }}
                size="small">
                {isHebrew ? <ArrowBack /> : <ArrowForward />}
              </IconButton>
            ) : null}
          </>
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
