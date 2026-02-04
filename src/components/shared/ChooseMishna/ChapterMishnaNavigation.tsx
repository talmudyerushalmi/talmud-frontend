import React from 'react';
import ChooseChapter, { leanChapter } from './ChooseChapter';
import ChooseMishna, { iMishnaForNavigation } from './ChooseMishna';
import { iChapter, iTractate } from '../../../types/types';
import NavigationArrow from './NavigationArrow';
import { BaseNavigationComponentProps, CoreChapterMishnaSetters } from './navigationTypes';

interface ChapterMishnaNavigationProps extends BaseNavigationComponentProps, CoreChapterMishnaSetters {
  showDafAmudNavigation: boolean;
  lineNumber: string;
  chapterName: string;
  mishnaName: string;
  tractateData: iTractate | null;
  chapterData: iChapter | null;
  allChapterAllowed?: boolean;
  setChapterData: (value: iChapter | null) => void;
  setMishnaData: (value: iMishnaForNavigation | null) => void;
  onUserSelectMishna: (mishna: iMishnaForNavigation) => void;
}

const ChapterMishnaNavigation: React.FC<ChapterMishnaNavigationProps> = ({
  isHebrew,
  navButtons,
  showDafAmudNavigation,
  lineNumber,
  chapterName,
  mishnaName,
  tractateData,
  chapterData,
  allChapterAllowed,
  isNavigating,
  setChapterName,
  setChapterData,
  setMishnaName,
  setMishnaData,
  onNavigateBack,
  onNavigateForward,
  onUserSelectMishna,
}) => {
  return (
    <>
      {/* Navigation arrows for Chapter/Halakha - left arrow */}
      {navButtons && (showDafAmudNavigation || !lineNumber) && (
        <NavigationArrow direction="back" isHebrew={isHebrew} onClick={onNavigateBack} />
      )}

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
        onUserSelectMishna={onUserSelectMishna}
      />

      {/* Navigation arrows for Chapter/Halakha - only show if:
          - No line selector at all, OR
          - Daf/Amud navigation is enabled (regardless of line selector) */}
      {navButtons && (showDafAmudNavigation || !lineNumber) && (
        <NavigationArrow direction="forward" isHebrew={isHebrew} onClick={onNavigateForward} />
      )}
    </>
  );
};

export default ChapterMishnaNavigation;
