import React, { useState, useEffect, SyntheticEvent } from 'react';
import { iTractate } from '../../../types/types';
import { getChooseTractateAutocompleteStyles, getChooseMishnaTextFieldStyles } from './NavigationDropdownStyles';
import NavigationAutocomplete from './NavigationAutocomplete';
import { useIsHebrew } from './navigationTypes';

interface Props {
  tractate: string;
  onSelectTractate: (tractate: iTractate) => void;
  allTractates?: iTractate[];
}

const ChooseTractate = (props: Props) => {
  const { tractate, onSelectTractate, allTractates } = props;
  const [selectedTractate, setSelectedTractate] = useState<iTractate | null>(null);

  const isHebrew = useIsHebrew();

  const formatTractateName = (id: string): string => {
    return id
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const _onChange = (event: SyntheticEvent<Element, Event>, tractate: iTractate | null) => {
    if (tractate) {
      onSelectTractate(tractate);
    }
  };

  useEffect(() => {
    const found = allTractates?.find((t) => t.id === tractate);
    if (found) {
      setSelectedTractate(found);
      onSelectTractate(found);
    }
  }, [tractate, allTractates]);

  return (
    <NavigationAutocomplete
      label="Tractate"
      value={selectedTractate}
      options={allTractates || []}
      getOptionLabel={(option) => isHebrew ? option.title_heb : formatTractateName(option.id)}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      onChange={_onChange}
      customSx={getChooseTractateAutocompleteStyles(isHebrew)}
      customTextFieldSx={getChooseMishnaTextFieldStyles(isHebrew)}
      inputLabelProps={{ shrink: true }}
    />
  );
};

export default ChooseTractate;
