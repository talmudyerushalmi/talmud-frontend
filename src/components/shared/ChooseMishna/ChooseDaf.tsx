import React, { useState, useEffect, SyntheticEvent } from 'react';
import { getChooseMishnaAutocompleteStyles, getChooseMishnaTextFieldStyles } from './NavigationDropdownStyles';
import { hebrewToNumber } from '../../../inc/utils';
import NavigationAutocomplete from './NavigationAutocomplete';
import { useIsHebrew } from './navigationTypes';
import { getAllDafsFromTractate, leanDaf } from '../../../services/dafAmudService';
import { iTractate } from '../../../types/types';

export type { leanDaf };

interface Props {
  daf: string;
  tractate: iTractate | null;
  onSelectDaf: (daf: leanDaf) => void;
}

const ChooseDaf = (props: Props) => {
  const { daf, onSelectDaf, tractate } = props;
  const [selectedDaf, setSelectedDaf] = useState<leanDaf | null>(null);
  const [dafOptions, setDafOptions] = useState<leanDaf[]>([]);

  const isHebrew = useIsHebrew();

  // Build daf options from tractate data (no API call)
  useEffect(() => {
    if (tractate) {
      const dafList = getAllDafsFromTractate(tractate);
      setDafOptions(dafList);
    } else {
      setDafOptions([]);
    }
  }, [tractate]);

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
      inputLabelProps={{ shrink: true }}
    />
  );
};

export default ChooseDaf;

