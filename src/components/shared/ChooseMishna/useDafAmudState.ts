import { useState, useEffect } from 'react';
import { iLink, iTractate } from '../../../types/types';
import { iMishnaForNavigation } from './ChooseMishna';
import { leanDaf } from './ChooseDaf';
import { getAmudimsForDafFromTractate } from '../../../services/dafAmudService';

interface UseDafAmudStateProps {
  initValues: iLink | null;
  tractateData: iTractate | null;
  mishnaData: iMishnaForNavigation | null;
}

export const useDafAmudState = ({
  initValues,
  tractateData,
  mishnaData,
}: UseDafAmudStateProps) => {
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

  // Helper function to update dafData from tractate data (no API call)
  const updateDafDataFromTractate = (dafId: string, tractate: iTractate) => {
    const amudim = getAmudimsForDafFromTractate(tractate, dafId);
    setDafData({
      id: dafId,
      amudim,
    });
  };

  // Restore dafData when tractateData loads and we have dafName
  useEffect(() => {
    if (dafName && tractateData && !dafData) {
      updateDafDataFromTractate(dafName, tractateData);
    }
  }, [tractateData, dafName, dafData]);

  // Sync Daf/Amud when Chapter/Mishna changes
  // This updates the Daf/Amud dropdowns to match the currently displayed mishna
  // BUT: Only when the mishna's chapter/halacha is different from what we're showing
  useEffect(() => {
    if (!mishnaData || !mishnaData.daf || !mishnaData.amud || !tractateData) {
      return;
    }
    
    const newDaf = mishnaData.daf;
    const newAmud = mishnaData.amud;
    
    // Only update if BOTH daf and amud are different
    // This prevents override when we navigate via Daf/Amud arrows
    // (because the arrow navigation updates daf/amud BEFORE mishna loads)
    if (newDaf !== dafName && newAmud !== amudName) {
      setDafName(newDaf);
      setAmudName(newAmud);
      updateDafDataFromTractate(newDaf, tractateData);
    }
  }, [mishnaData?.mishna, tractateData]); // Only trigger when mishna changes, not daf/amud

  return {
    dafName,
    setDafName,
    amudName,
    setAmudName,
    dafData,
    setDafData,
  };
};
