import { iLink, iTractate } from '../../../types/types';
import { iMishnaForNavigation } from './ChooseMishna';
import { leanDaf } from './ChooseDaf';
import { useChapterMishnaNavigation } from './useChapterMishnaNavigation';
import { useDafAmudNavigation } from './useDafAmudNavigation';
import { Direction } from './navigationTypes';

interface NavigationState {
  tractateName: string;
  chapterName: string;
  mishnaName: string;
  lineNumber: string;
  mishnaData: iMishnaForNavigation | null;
  tractateData: iTractate | null;
  dafName: string;
  amudName: string;
}

interface NavigationHandlersProps {
  state: NavigationState;
  setters: {
    setTractateName: (value: string) => void;
    setChapterName: (value: string) => void;
    setMishnaName: (value: string) => void;
    setLineNumber: (value: string) => void;
    setTractateData: (value: iTractate | null) => void;
    setDafName: (value: string) => void;
    setAmudName: (value: string) => void;
    setDafData: (value: leanDaf | null) => void;
  };
  allTractates?: iTractate[];
  onButtonNavigation: (nav: iLink) => void;
  onNavigationUpdated: (nav: iLink) => void;
}

/**
 * Wrapper hook that combines Chapter/Mishna and Daf/Amud navigation
 * Provides a single interface for ChooseMishnaForm to use
 */
export const useNavigationHandlers = ({
  state,
  setters,
  allTractates,
  onButtonNavigation,
  onNavigationUpdated,
}: NavigationHandlersProps) => {
  const {
    tractateName,
    chapterName,
    mishnaName,
    lineNumber,
    mishnaData,
    tractateData,
    dafName,
    amudName,
  } = state;

  const {
    setTractateName,
    setChapterName,
    setMishnaName,
    setLineNumber,
    setTractateData,
    setDafName,
    setAmudName,
    setDafData,
  } = setters;

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

  return {
    navigateHandler,
    navigateDafAmudHandler,
    Direction,
  };
};
