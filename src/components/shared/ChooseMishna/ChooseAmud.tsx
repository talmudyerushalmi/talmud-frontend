import React, { useState, useEffect, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { getChooseMishnaAutocompleteStyles, getChooseMishnaTextFieldStyles } from './NavigationDropdownStyles';
import amudDafMapping from '../../../data/amud_daf_mapping.json';
import { leanDaf } from './ChooseDaf';
import { hebrewAmudToEnglish } from '../../../inc/utils';
import NavigationAutocomplete from './NavigationAutocomplete';

export interface AmudMapping {
  chapter: string;
  halacha: string;
  system_line: string;
}

interface Props {
  amud: string;
  inDaf: leanDaf | null;
  inTractate: string;
  onSelectAmud: (amud: string, mapping: AmudMapping) => void;
}

// Type guard to check if the data has the expected structure
function isAmudMapping(data: unknown): data is AmudMapping {
  return (
    typeof data === 'object' &&
    data !== null &&
    'chapter' in data &&
    'halacha' in data &&
    'system_line' in data
  );
}

const ChooseAmud = (props: Props) => {
  const { amud, onSelectAmud, inDaf, inTractate } = props;
  const [selectedAmud, setSelectedAmud] = useState<string | null>(null);
  const [amudOptions, setAmudOptions] = useState<string[]>([]);

  const { i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';

  // Build amud options from the selected Daf
  useEffect(() => {
    if (inDaf && inDaf.amudim) {
      setAmudOptions(inDaf.amudim);
    } else {
      setAmudOptions([]);
    }
  }, [inDaf]);

  const _onChange = (event: SyntheticEvent<Element, Event>, amud: string | null) => {
    if (!amud || !inDaf || !inTractate) {
      return;
    }
    
    setSelectedAmud(amud);

    // Retrieve mapping data from JSON
    const tractateData = amudDafMapping[inTractate as keyof typeof amudDafMapping];
    if (tractateData && tractateData[inDaf.id as keyof typeof tractateData]) {
      const dafData = tractateData[inDaf.id as keyof typeof tractateData];
      const amudData = dafData[amud as keyof typeof dafData];
      
      if (isAmudMapping(amudData)) {
        onSelectAmud(amud, amudData);
      }
    }
  };

  useEffect(() => {
    // If amud is empty, clear selection to show placeholder
    if (amud === '') {
      setSelectedAmud(null);
      return;
    }
    
    const found = amudOptions.find((a) => a === amud);
    if (found && selectedAmud !== found) {
      setSelectedAmud(found);
    }
  }, [amudOptions, amud, selectedAmud]);

  // Helper function to convert Hebrew letters to English letters
  const getAmudLabel = (amudId: string): string => {
    if (isHebrew) {
      return amudId; // Keep Hebrew letters
    }
    // Convert Hebrew letters to English letters for English
    return hebrewAmudToEnglish(amudId);
  };

  return (
    <NavigationAutocomplete
      label="Column"
      value={selectedAmud}
      options={amudOptions}
      getOptionLabel={(option) => getAmudLabel(option)}
      isOptionEqualToValue={(option, value) => option === value}
      onChange={_onChange}
      customSx={getChooseMishnaAutocompleteStyles(isHebrew)}
      customTextFieldSx={getChooseMishnaTextFieldStyles(isHebrew)}
    />
  );
};

export default ChooseAmud;

