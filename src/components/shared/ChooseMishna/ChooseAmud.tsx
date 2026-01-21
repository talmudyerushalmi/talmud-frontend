import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getChooseMishnaAutocompleteStyles, getChooseMishnaTextFieldStyles } from './chooseMishnaStyles';
import amudDafMapping from '../../../data/amud_daf_mapping.json';
import { leanDaf } from './ChooseDaf';

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
      
      if (amudData) {
        const mapping: AmudMapping = {
          chapter: amudData.chapter,
          halacha: amudData.halacha,
          system_line: amudData.system_line,
          word_pos: amudData.word_pos,
        };
        onSelectAmud(amud, mapping);
      }
    }
  };

  useEffect(() => {
    const found = amudOptions.find((a) => a === amud);
    if (found && selectedAmud !== found) {
      setSelectedAmud(found);
    }
  }, [amudOptions, amud, selectedAmud]);

  return (
    <>
      <Autocomplete
        sx={getChooseMishnaAutocompleteStyles(isHebrew)}
        onChange={_onChange}
        value={selectedAmud}
        options={amudOptions}
        autoHighlight={true}
        getOptionLabel={(option) => option}
        isOptionEqualToValue={(option, value) => option === value}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label={t('Amud')} 
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

