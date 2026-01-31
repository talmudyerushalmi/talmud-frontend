import { useCallback } from 'react';
import { iLink, iTractate } from '../../../types/types';
import { leanDaf } from './ChooseDaf';
import { AmudMapping } from './ChooseAmud';
import amudDafMapping from '../../../data/amud_daf_mapping.json';
import { Direction } from './useChapterMishnaNavigation';

interface DafAmudNavigationProps {
  tractateName: string;
  tractateData: iTractate | null;
  dafName: string;
  amudName: string;
  allTractates?: iTractate[];
  setTractateName: (value: string) => void;
  setTractateData: (value: iTractate | null) => void;
  setDafName: (value: string) => void;
  setAmudName: (value: string) => void;
  setDafData: (value: leanDaf | null) => void;
  setChapterName: (value: string) => void;
  setMishnaName: (value: string) => void;
  setLineNumber: (value: string) => void;
  onNavigationUpdated: (nav: iLink) => void;
}

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
  
  const navigateDafAmudHandler = useCallback((direction: Direction) => {
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
    if (needsCrossTractateNavigation && allTractates && allTractates.length > 0) {
      const currentTractateIndex = allTractates.findIndex((t) => t.id === tractateName);
      
      if (direction === Direction.FORWARD && currentTractateIndex !== -1 && currentTractateIndex < allTractates.length - 1) {
        // Go to next tractate, first daf, first amud
        const nextTractate = allTractates[currentTractateIndex + 1];
        const nextTractateMapping = amudDafMapping[nextTractate.title_heb as keyof typeof amudDafMapping];
        
        if (nextTractateMapping) {
          const firstDaf = Object.keys(nextTractateMapping)[0];
          const firstDafData = nextTractateMapping[firstDaf as keyof typeof nextTractateMapping];
          const firstAmud = Object.keys(firstDafData)[0];
          const amudData = firstDafData[firstAmud as keyof typeof firstDafData] as AmudMapping;
          
          if (amudData && typeof amudData === 'object') {
            // Update tractate
            setTractateName(nextTractate.id);
            setTractateData(nextTractate);
            
            // Update daf/amud
            setDafName(firstDaf);
            setAmudName(firstAmud);
            setDafData({
              id: firstDaf,
              amudim: Object.keys(firstDafData),
            });
            
            // Navigate to the mapped chapter/halacha
            setChapterName(amudData.chapter);
            setMishnaName(amudData.halacha);
            setLineNumber('');
            
            // Trigger navigation
            onNavigationUpdated({
              tractate: nextTractate.id,
              chapter: amudData.chapter,
              mishna: amudData.halacha,
              lineNumber: '',
              dafAmudMarkers: [{
                line: amudData.system_line,
                daf: firstDaf,
                amud: firstAmud,
              }],
            });
            return;
          }
        }
      } else if (direction === Direction.BACK && currentTractateIndex > 0) {
        // Go to previous tractate, last daf, last amud
        const previousTractate = allTractates[currentTractateIndex - 1];
        const prevTractateMapping = amudDafMapping[previousTractate.title_heb as keyof typeof amudDafMapping];
        
        if (prevTractateMapping) {
          const allPrevDafim = Object.keys(prevTractateMapping);
          const lastDaf = allPrevDafim[allPrevDafim.length - 1];
          const lastDafData = prevTractateMapping[lastDaf as keyof typeof prevTractateMapping];
          const allLastAmudim = Object.keys(lastDafData);
          const lastAmud = allLastAmudim[allLastAmudim.length - 1];
          const amudData = lastDafData[lastAmud as keyof typeof lastDafData] as AmudMapping;
          
          if (amudData && typeof amudData === 'object') {
            // Update tractate
            setTractateName(previousTractate.id);
            setTractateData(previousTractate);
            
            // Update daf/amud
            setDafName(lastDaf);
            setAmudName(lastAmud);
            setDafData({
              id: lastDaf,
              amudim: Object.keys(lastDafData),
            });
            
            // Navigate to the mapped chapter/halacha
            setChapterName(amudData.chapter);
            setMishnaName(amudData.halacha);
            setLineNumber('');
            
            // Trigger navigation
            onNavigationUpdated({
              tractate: previousTractate.id,
              chapter: amudData.chapter,
              mishna: amudData.halacha,
              lineNumber: '',
              dafAmudMarkers: [{
                line: amudData.system_line,
                daf: lastDaf,
                amud: lastAmud,
              }],
            });
            return;
          }
        }
      }
      
      // Can't navigate further
      return;
    }

    if (needsCrossTractateNavigation) {
      // No allTractates available or can't navigate
      return;
    }

    // Get mapping for the new daf/amud (within same tractate)
    const newDafData = tractateMapping[nextDaf as keyof typeof tractateMapping];
    const amudData = newDafData[nextAmud as keyof typeof newDafData] as AmudMapping;

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
          daf: nextDaf,
          amud: nextAmud,
        }],
      });
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
