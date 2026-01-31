import { useCallback } from 'react';
import { iLink, iTractate } from '../../../types/types';
import { getNext, getPrevious } from '../../../inc/utils';
import { iMishnaForNavigation } from './ChooseMishna';

export enum Direction {
  BACK = 'BACK',
  FORWARD = 'FORWARD',
}

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
  
  const navigateHandler = useCallback((direction: Direction) => {
    const navigateTo =
      direction === Direction.BACK
        ? getPrevious(tractateName, chapterName, mishnaName, lineNumber, mishnaData)
        : getNext(tractateName, chapterName, mishnaName, lineNumber, mishnaData);
    
    // If no navigation within current tractate, try cross-tractate navigation
    if (!navigateTo && allTractates && allTractates.length > 0) {
      const currentTractateIndex = allTractates.findIndex((t) => t.id === tractateName);
      
      if (direction === Direction.FORWARD && currentTractateIndex !== -1 && currentTractateIndex < allTractates.length - 1) {
        // Go to next tractate, first chapter, first mishna
        const nextTractate = allTractates[currentTractateIndex + 1];
        if (nextTractate.chapters && nextTractate.chapters.length > 0) {
          const firstChapter = nextTractate.chapters[0];
          if (firstChapter.mishnaiot && firstChapter.mishnaiot.length > 0) {
            const firstMishna = firstChapter.mishnaiot[0];
            
            setTractateName(nextTractate.id);
            setChapterName(firstChapter.id);
            setMishnaName(firstMishna.mishna);
            setLineNumber('');
            
            onButtonNavigation({
              tractate: nextTractate.id,
              chapter: firstChapter.id,
              mishna: firstMishna.mishna,
              lineNumber: '',
            });
            return;
          }
        }
      } else if (direction === Direction.BACK && currentTractateIndex > 0) {
        // Go to previous tractate, last chapter, last mishna
        const previousTractate = allTractates[currentTractateIndex - 1];
        if (previousTractate.chapters && previousTractate.chapters.length > 0) {
          const lastChapter = previousTractate.chapters[previousTractate.chapters.length - 1];
          if (lastChapter.mishnaiot && lastChapter.mishnaiot.length > 0) {
            const lastMishna = lastChapter.mishnaiot[lastChapter.mishnaiot.length - 1];
            
            setTractateName(previousTractate.id);
            setChapterName(lastChapter.id);
            setMishnaName(lastMishna.mishna);
            setLineNumber('');
            
            onButtonNavigation({
              tractate: previousTractate.id,
              chapter: lastChapter.id,
              mishna: lastMishna.mishna,
              lineNumber: '',
            });
            return;
          }
        }
      }
      
      // Can't navigate further
      return;
    }
    
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
