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

  // Helper function to convert Hebrew letters to numbers for English
  const getDafLabel = (dafId: string): string => {
    if (isHebrew) {
      return dafId; // Keep Hebrew letters
    }
    // Convert Hebrew letters to numbers for English
    const hebrewToNumber: { [key: string]: number } = {
      'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9, 'י': 10,
      'יא': 11, 'יב': 12, 'יג': 13, 'יד': 14, 'טו': 15, 'טז': 16, 'יז': 17, 'יח': 18, 'יט': 19, 'כ': 20,
      'כא': 21, 'כב': 22, 'כג': 23, 'כד': 24, 'כה': 25, 'כו': 26, 'כז': 27, 'כח': 28, 'כט': 29, 'ל': 30,
      'לא': 31, 'לב': 32, 'לג': 33, 'לד': 34, 'לה': 35, 'לו': 36, 'לז': 37, 'לח': 38, 'לט': 39, 'מ': 40,
      'מא': 41, 'מב': 42, 'מג': 43, 'מד': 44, 'מה': 45, 'מו': 46, 'מז': 47, 'מח': 48, 'מט': 49, 'ן': 50,
    };
    return hebrewToNumber[dafId]?.toString() || dafId;
  };

  return (
    <>
      <Autocomplete
        sx={getChooseMishnaAutocompleteStyles(isHebrew)}
        onChange={_onChange}
        value={selectedDaf}
        options={dafOptions}
        autoHighlight={true}
        getOptionLabel={(option) => getDafLabel(option.id)}
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

