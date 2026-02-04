import { useCallback } from 'react';
import { iLink, iTractate } from '../../../types/types';
import { leanDaf } from './ChooseDaf';
import { AmudMapping } from './ChooseAmud';
import amudDafMapping from '../../../data/amud_daf_mapping.json';
import { Direction, BaseNavigationSetters } from './navigationTypes';
import { useCrossTractateNavigation } from './useCrossTractateNavigation';

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
 * Helper function to get the first or last daf/amud from a tractate mapping
 */
const getDafAmudFromMapping = (
  tractateMapping: any,
  position: 'first' | 'last'
): { daf: string; dafData: any; amud: string } | null => {
  if (position === 'first') {
    const daf = Object.keys(tractateMapping)[0];
    const dafData = tractateMapping[daf as keyof typeof tractateMapping];
    const amud = Object.keys(dafData)[0];
    return { daf, dafData, amud };
  } else {
    const allDafim = Object.keys(tractateMapping);
    const daf = allDafim[allDafim.length - 1];
    const dafData = tractateMapping[daf as keyof typeof tractateMapping];
    const allAmudim = Object.keys(dafData);
    const amud = allAmudim[allAmudim.length - 1];
    return { daf, dafData, amud };
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
  targetDafData: any,
  amudData: AmudMapping,
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
  setters.setDafData({
    id: targetDaf,
    amudim: Object.keys(targetDafData),
  });
  
  // Navigate to the mapped chapter/halacha
  setters.setChapterName(amudData.chapter);
  setters.setMishnaName(amudData.halacha);
  setters.setLineNumber('');
  
  // Trigger navigation
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

/**
 * Custom hook for Daf/Amud navigation with cross-tractate support
 */
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
  
  const { attemptCrossTractateNavigation } = useCrossTractateNavigation();
  
  const navigateDafAmudHandler = useCallback((direction: Direction) => {
    if (!tractateData?.title_heb || !dafName || !amudName) {
      return;
    }

    const tractateMapping = amudDafMapping[tractateData.title_heb as keyof typeof amudDafMapping];
    if (!tractateMapping) {
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
    let needsCrossTractateNavigation = false;

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
          // At end of tractate - need to go to next tractate
          needsCrossTractateNavigation = true;
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
          // At start of tractate - need to go to previous tractate
          needsCrossTractateNavigation = true;
        }
      }
    }

    // Handle cross-tractate navigation
    if (needsCrossTractateNavigation) {
      attemptCrossTractateNavigation(
        tractateName,
        allTractates,
        direction,
        (targetTractate, position) => {
          const targetTractateMapping = amudDafMapping[targetTractate.title_heb as keyof typeof amudDafMapping];
          
          if (targetTractateMapping) {
            const result = getDafAmudFromMapping(targetTractateMapping, position);
            
            if (result) {
              const amudData = result.dafData[result.amud as keyof typeof result.dafData] as AmudMapping;
              
              if (amudData && typeof amudData === 'object') {
                performDafAmudNavigation(targetTractate, tractateName, result.daf, result.amud, result.dafData, amudData, setters, onNavigationUpdated);
                return true;
              }
            }
          }
          return false;
        }
      );
      return;
    }

    // Get mapping for the new daf/amud (within same tractate)
    const newDafData = tractateMapping[nextDaf as keyof typeof tractateMapping];
    const amudData = newDafData[nextAmud as keyof typeof newDafData] as AmudMapping;

    if (amudData && typeof amudData === 'object') {
      performDafAmudNavigation(null, tractateName, nextDaf, nextAmud, newDafData, amudData, setters, onNavigationUpdated);
    }
  }, [
    tractateData,
    dafName,
    amudName,
    tractateName,
    allTractates,
    onNavigationUpdated,
    setTractateName,
    setTractateData,
    setDafName,
    setAmudName,
    setDafData,
    setChapterName,
    setMishnaName,
    setLineNumber,
  ]);

  return { navigateDafAmudHandler };
};
