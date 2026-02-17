import React, { useState, useEffect, SyntheticEvent } from 'react';
import { getChooseMishnaAutocompleteStyles, getChooseMishnaTextFieldStyles } from './NavigationDropdownStyles';
import { leanDaf } from './ChooseDaf';
import { hebrewAmudToEnglish } from '../../../inc/utils';
import NavigationAutocomplete from './NavigationAutocomplete';
import { useIsHebrew } from './navigationTypes';
import { getDafAmudMappingFromTractate } from '../../../services/dafAmudService';
import { iTractate, AmudMapping } from '../../../types/types';

export type { AmudMapping };

interface Props {
  amud: string;
  inDaf: leanDaf | null;
  tractate: iTractate | null;
  onSelectAmud: (amud: string, mapping: Omit<AmudMapping, 'amud'>) => void;
}

const ChooseAmud = (props: Props) => {
  const { amud, onSelectAmud, inDaf, tractate } = props;
  const [selectedAmud, setSelectedAmud] = useState<string | null>(null);
  const [amudOptions, setAmudOptions] = useState<string[]>([]);

  const isHebrew = useIsHebrew();

  // Build amud options from the selected Daf
  useEffect(() => {
    if (inDaf && inDaf.amudim) {
      setAmudOptions(inDaf.amudim);
    } else {
      setAmudOptions([]);
    }
  }, [inDaf]);

  const _onChange = (event: SyntheticEvent<Element, Event>, amud: string | null) => {
    if (!amud || !inDaf || !tractate) {
      return;
    }
    
    setSelectedAmud(amud);

    // Retrieve mapping data from tractate (no API call)
    const mapping = getDafAmudMappingFromTractate(tractate, inDaf.id, amud);
    if (mapping) {
      onSelectAmud(amud, mapping);
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

