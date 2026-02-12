import { useState, useEffect } from 'react';
import { iLink, iTractate } from '../../../types/types';
import { iMishnaForNavigation } from './ChooseMishna';
import { leanDaf } from './ChooseDaf';
import { getAmudimsForDaf } from '../../../services/dafAmudService';

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

  // Helper function to update dafData from API
  const updateDafDataFromMapping = async (dafId: string, tractateTitle: string) => {
    const amudim = await getAmudimsForDaf(tractateTitle, dafId);
    setDafData({
      id: dafId,
      amudim,
    });
  };

  // Restore dafData when tractateData loads and we have dafName
  useEffect(() => {
    if (dafName && tractateData?.title_heb && !dafData) {
      updateDafDataFromMapping(dafName, tractateData.title_heb);
    }
  }, [tractateData, dafName, dafData]);

  // Sync Daf/Amud when mishnaData changes (reverse sync from Chapter/Mishna to Daf/Amud)
  useEffect(() => {
    if (mishnaData && mishnaData.daf && mishnaData.amud && tractateData?.title_heb) {
      const newDaf = mishnaData.daf;
      const newAmud = mishnaData.amud;
      
      // Only update if different from current values
      if (newDaf !== dafName || newAmud !== amudName) {
        setDafName(newDaf);
        setAmudName(newAmud);
        updateDafDataFromMapping(newDaf, tractateData.title_heb);
      }
    }
  }, [mishnaData, tractateData]); // Removed dafName and amudName from dependencies to prevent override

  return {
    dafName,
    setDafName,
    amudName,
    setAmudName,
    dafData,
    setDafData,
  };
};
