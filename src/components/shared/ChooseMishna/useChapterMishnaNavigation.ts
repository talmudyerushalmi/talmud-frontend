import { useCallback } from 'react';
import { iLink, iTractate } from '../../../types/types';
import { getNext, getPrevious } from '../../../inc/utils';
import { iMishnaForNavigation } from './ChooseMishna';
import { useCrossTractateNavigation } from './useCrossTractateNavigation';
import { Direction, BaseNavigationSetters } from './navigationTypes';

interface ChapterMishnaNavigationProps {
  tractateName: string;
  chapterName: string;
  mishnaName: string;
  lineNumber: string;
  mishnaData: iMishnaForNavigation | null;
  allTractates?: iTractate[];
  setTractateName: (value: string) => void;
  setChapterName: (value: string) => void;
  setMishnaName: (value: string) => void;
  setLineNumber: (value: string) => void;
  onButtonNavigation: (nav: iLink) => void;
}

/**
 * Helper function to navigate to a specific chapter/mishna in a tractate
 */
const navigateToChapterMishna = (
  tractate: iTractate,
  chapterIndex: number,
  mishnaIndex: number,
  setters: BaseNavigationSetters,
  onButtonNavigation: (nav: iLink) => void
): boolean => {
  if (tractate.chapters && tractate.chapters.length > chapterIndex) {
    const targetChapter = tractate.chapters[chapterIndex];
    if (targetChapter.mishnaiot && targetChapter.mishnaiot.length > mishnaIndex) {
      const targetMishna = targetChapter.mishnaiot[mishnaIndex];
      
      setters.setTractateName(tractate.id);
      setters.setChapterName(targetChapter.id);
      setters.setMishnaName(targetMishna.mishna);
      setters.setLineNumber('');
      
      onButtonNavigation({
        tractate: tractate.id,
        chapter: targetChapter.id,
        mishna: targetMishna.mishna,
        lineNumber: '',
      });
      return true;
    }
  }
  return false;
};

/**
 * Custom hook for Chapter/Mishna navigation with cross-tractate support
 */
export const useChapterMishnaNavigation = ({
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
}: ChapterMishnaNavigationProps) => {
  
  const { attemptCrossTractateNavigation } = useCrossTractateNavigation();
  
  const navigateHandler = useCallback((direction: Direction) => {
    const navigateTo =
      direction === Direction.BACK
        ? getPrevious(tractateName, chapterName, mishnaName, lineNumber, mishnaData)
        : getNext(tractateName, chapterName, mishnaName, lineNumber, mishnaData);
    
    // If no navigation within current tractate, try cross-tractate navigation
    if (!navigateTo) {
      const setters = { setTractateName, setChapterName, setMishnaName, setLineNumber };
      
      attemptCrossTractateNavigation(
        tractateName,
        allTractates,
        direction,
        (targetTractate, position) => {
          if (position === 'first') {
            return navigateToChapterMishna(targetTractate, 0, 0, setters, onButtonNavigation);
          } else {
            const lastChapterIndex = (targetTractate.chapters?.length || 0) - 1;
            const lastMishnaIndex = (targetTractate.chapters?.[lastChapterIndex]?.mishnaiot?.length || 0) - 1;
            return navigateToChapterMishna(targetTractate, lastChapterIndex, lastMishnaIndex, setters, onButtonNavigation);
          }
        }
      );
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
  }, [
    tractateName,
    chapterName,
    mishnaName,
    lineNumber,
    mishnaData,
    allTractates,
    onButtonNavigation,
    setTractateName,
    setChapterName,
    setMishnaName,
    setLineNumber,
  ]);

  return { navigateHandler };
};
