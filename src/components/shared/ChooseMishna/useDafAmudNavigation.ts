import { useCallback } from 'react';
import { iLink, iTractate, AmudMapping } from '../../../types/types';
import { leanDaf } from './ChooseDaf';
import { Direction, BaseNavigationSetters } from './navigationTypes';
import { useCrossTractateNavigation } from './useCrossTractateNavigation';
import { getAllDafsFromTractate, getDafAmudMappingFromTractate } from '../../../services/dafAmudService';

/**
 * Extended setters for Daf/Amud navigation (includes base setters + daf-specific ones)
 */
export interface DafAmudNavigationSetters extends BaseNavigationSetters {
  setTractateData: (value: iTractate | null) => void;
  setDafName: (value: string) => void;
  setAmudName: (value: string) => void;
  setDafData: (value: leanDaf | null) => void;
}

interface DafAmudNavigationProps extends DafAmudNavigationSetters {
  tractateName: string;
  tractateData: iTractate | null;
  dafName: string;
  amudName: string;
  allTractates?: iTractate[];
  onNavigationUpdated: (nav: iLink) => void;
}

/**
 * Helper function to get the first or last daf/amud from a tractate
 */
const getDafAmudFromTractate = (
  tractate: iTractate,
  position: 'first' | 'last'
): { daf: string; dafData: leanDaf; amud: string } | null => {
  const dafList = getAllDafsFromTractate(tractate);
  if (dafList.length === 0) return null;
  
  if (position === 'first') {
    const dafData = dafList[0];
    const amud = dafData.amudim[0] || '';
    return { daf: dafData.id, dafData, amud };
  } else {
    const dafData = dafList[dafList.length - 1];
    const amud = dafData.amudim[dafData.amudim.length - 1] || '';
    return { daf: dafData.id, dafData, amud };
  }
};

/**
 * Helper function to perform the actual navigation to a daf/amud
 */
const performDafAmudNavigation = (
  targetTractate: iTractate | null,
  currentTractateName: string,
  targetDaf: string,
  targetAmud: string,
  targetDafData: leanDaf,
  amudData: Omit<AmudMapping, 'amud'>,
  setters: DafAmudNavigationSetters,
  onNavigationUpdated: (nav: iLink) => void
): void => {
  // Update tractate (if changing tractate)
  if (targetTractate) {
    setters.setTractateName(targetTractate.id);
    setters.setTractateData(targetTractate);
  }
  
  // Update daf/amud
  setters.setDafName(targetDaf);
  setters.setAmudName(targetAmud);
  setters.setDafData(targetDafData);
  
  // Navigate to the mapped chapter/halacha
  setters.setChapterName(amudData.chapter);
  setters.setMishnaName(amudData.halacha);
  setters.setLineNumber('');
  
  // Build navigation link with Daf/Amud markers
  onNavigationUpdated({
    tractate: targetTractate?.id || currentTractateName,
    chapter: amudData.chapter,
    mishna: amudData.halacha,
    lineNumber: '',
    dafAmudMarkers: [{
      line: amudData.system_line,
      daf: targetDaf,
      amud: targetAmud,
    }],
  });
};

export const useDafAmudNavigation = ({
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
}: DafAmudNavigationProps) => {
  
  const { getCrossTractateTarget } = useCrossTractateNavigation();
  
  const navigateDafAmudHandler = useCallback(async (direction: Direction) => {
    if (!tractateData || !dafName || !amudName) {
      return;
    }

    // Get all dafim for current tractate (from tractate data, no API call)
    const dafList = getAllDafsFromTractate(tractateData);
    if (dafList.length === 0) {
      return;
    }

    // Create setters object once
    const setters = {
      setTractateName,
      setTractateData,
      setDafName,
      setAmudName,
      setDafData,
      setChapterName,
      setMishnaName,
      setLineNumber,
    };

    // Find current daf and amud indices
    const currentDafIndex = dafList.findIndex(d => d.id === dafName);
    if (currentDafIndex === -1) {
      return;
    }

    const currentDafData = dafList[currentDafIndex];
    const currentAmudIndex = currentDafData.amudim.indexOf(amudName);

    let nextDaf = dafName;
    let nextAmud = amudName;
    let nextDafData = currentDafData;
    let needsCrossTractateNavigation = false;

    if (direction === Direction.FORWARD) {
      // Try next amud in current daf
      if (currentAmudIndex < currentDafData.amudim.length - 1) {
        nextAmud = currentDafData.amudim[currentAmudIndex + 1];
      } else {
        // Go to first amud of next daf
        if (currentDafIndex < dafList.length - 1) {
          nextDafData = dafList[currentDafIndex + 1];
          nextDaf = nextDafData.id;
          nextAmud = nextDafData.amudim[0];
        } else {
          // At end of tractate - need to go to next tractate
          needsCrossTractateNavigation = true;
        }
      }
    } else {
      // Try previous amud in current daf
      if (currentAmudIndex > 0) {
        nextAmud = currentDafData.amudim[currentAmudIndex - 1];
      } else {
        // Go to last amud of previous daf
        if (currentDafIndex > 0) {
          nextDafData = dafList[currentDafIndex - 1];
          nextDaf = nextDafData.id;
          nextAmud = nextDafData.amudim[nextDafData.amudim.length - 1];
        } else {
          // At start of tractate - need to go to previous tractate
          needsCrossTractateNavigation = true;
        }
      }
    }

    // Handle cross-tractate navigation
    if (needsCrossTractateNavigation) {
      const { tractate: targetTractate, position } = getCrossTractateTarget(
        tractateName,
        allTractates,
        direction
      );
      
      if (targetTractate && position) {
        const result = getDafAmudFromTractate(targetTractate, position);
        
        if (result) {
          const amudData = getDafAmudMappingFromTractate(targetTractate, result.daf, result.amud);
          
          if (amudData) {
            performDafAmudNavigation(
              targetTractate,
              tractateName,
              result.daf,
              result.amud,
              result.dafData,
              amudData,
              setters,
              onNavigationUpdated
            );
          }
        }
      }
      return;
    }

    // Same-tractate navigation
    const amudData = getDafAmudMappingFromTractate(tractateData, nextDaf, nextAmud);
    
    if (amudData) {
      performDafAmudNavigation(
        null,
        tractateName,
        nextDaf,
        nextAmud,
        nextDafData,
        amudData,
        setters,
        onNavigationUpdated
      );
    }
  }, [
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
    getCrossTractateTarget,
  ]);

  return {
    navigateDafAmudHandler,
  };
};
