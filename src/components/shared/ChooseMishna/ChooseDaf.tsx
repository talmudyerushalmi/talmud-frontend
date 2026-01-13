import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getChooseMishnaAutocompleteStyles, getChooseMishnaTextFieldStyles } from './chooseMishnaStyles';
import amudDafMapping from '../../../data/amud_daf_mapping.json';

export interface leanDaf {
  id: string;  // Hebrew letter (ב, ג, ד...)
  amudim: string[];  // Array of amud values (א, ב)
}

interface Props {
  daf: string;
  inTractate: string;  // tractate name
  onSelectDaf: (daf: leanDaf) => void;
}

const ChooseDaf = (props: Props) => {
  const { daf, onSelectDaf, inTractate } = props;
  const [selectedDaf, setSelectedDaf] = useState<leanDaf | null>(null);
  const [dafOptions, setDafOptions] = useState<leanDaf[]>([]);

  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';

  // Build daf options from JSON mapping based on selected tractate
  useEffect(() => {
    if (inTractate && amudDafMapping[inTractate as keyof typeof amudDafMapping]) {
      const tractateData = amudDafMapping[inTractate as keyof typeof amudDafMapping];
      const dafList: leanDaf[] = Object.keys(tractateData).map((dafKey) => {
        const amudim = Object.keys(tractateData[dafKey as keyof typeof tractateData]);
        return {
          id: dafKey,
          amudim,
        };
      });
      setDafOptions(dafList);
    } else {
      setDafOptions([]);
    }
  }, [inTractate]);

  const _onChange = (event: SyntheticEvent<Element, Event>, daf: leanDaf | null) => {
    if (daf) {
      setSelectedDaf(daf);
      onSelectDaf(daf);
    }
  };

  useEffect(() => {
    const found = dafOptions.find((d) => d.id === daf);
    if (found && (!selectedDaf || selectedDaf.id !== found.id)) {
      setSelectedDaf(found);
    }
  }, [dafOptions, daf, selectedDaf]);

  return (
    <>
      <Autocomplete
        sx={getChooseMishnaAutocompleteStyles(isHebrew)}
        onChange={_onChange}
        value={selectedDaf}
        options={dafOptions}
        autoHighlight={true}
        getOptionLabel={(option) => option.id}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label={t('Daf')} 
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

export default ChooseDaf;

