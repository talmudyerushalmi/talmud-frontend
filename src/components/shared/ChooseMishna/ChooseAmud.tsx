import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getChooseMishnaAutocompleteStyles, getChooseMishnaTextFieldStyles } from './chooseMishnaStyles';
import amudDafMapping from '../../../data/amud_daf_mapping.json';
import { leanDaf } from './ChooseDaf';
import { hebrewAmudToEnglish } from '../../../inc/utils';

interface AmudMapping {
  chapter: string;
  halacha: string;
  system_line: string;
  word_pos: number;
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
    'system_line' in data &&
    'word_pos' in data
  );
}

const ChooseAmud = (props: Props) => {
  const { amud, onSelectAmud, inDaf, inTractate } = props;
  const [selectedAmud, setSelectedAmud] = useState<string | null>(null);
  const [amudOptions, setAmudOptions] = useState<string[]>([]);

  const { t, i18n } = useTranslation();
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
    <>
      <Autocomplete
        sx={getChooseMishnaAutocompleteStyles(isHebrew)}
        onChange={_onChange}
        value={selectedAmud}
        options={amudOptions}
        autoHighlight={true}
        getOptionLabel={(option) => getAmudLabel(option)}
        isOptionEqualToValue={(option, value) => option === value}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label={t('Column')} 
            variant="outlined" 
            sx={getChooseMishnaTextFieldStyles(isHebrew)} 
          />
        )}
        ListboxProps={{
          style: {
            direction: isHebrew ? 'rtl' : 'ltr',
          },
        }}
      />
    </>
  );
};

export default ChooseAmud;

