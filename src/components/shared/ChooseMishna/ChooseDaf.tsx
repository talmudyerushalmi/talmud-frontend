import React, { useState, useEffect, SyntheticEvent } from 'react';
import { getChooseMishnaAutocompleteStyles, getChooseMishnaTextFieldStyles } from './NavigationDropdownStyles';
import { hebrewToNumber } from '../../../inc/utils';
import NavigationAutocomplete from './NavigationAutocomplete';
import { useIsHebrew } from './navigationTypes';
import { getAllDafsForTractate, leanDaf } from '../../../services/dafAmudService';

export type { leanDaf };

interface Props {
  daf: string;
  inTractate: string;  // tractate name
  onSelectDaf: (daf: leanDaf) => void;
}

const ChooseDaf = (props: Props) => {
  const { daf, onSelectDaf, inTractate } = props;
  const [selectedDaf, setSelectedDaf] = useState<leanDaf | null>(null);
  const [dafOptions, setDafOptions] = useState<leanDaf[]>([]);

  const isHebrew = useIsHebrew();

  // Build daf options from API based on selected tractate
  useEffect(() => {
    if (inTractate) {
      getAllDafsForTractate(inTractate).then((dafList) => {
        setDafOptions(dafList);
      });
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
    return hebrewToNumber(dafId).toString();
  };

  return (
    <NavigationAutocomplete
      label="Folio"
      value={selectedDaf}
      options={dafOptions}
      getOptionLabel={(option) => getDafLabel(option.id)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={_onChange}
      customSx={getChooseMishnaAutocompleteStyles(isHebrew)}
      customTextFieldSx={getChooseMishnaTextFieldStyles(isHebrew)}
    />
  );
};

export default ChooseDaf;

