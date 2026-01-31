import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { iTractate } from '../../../types/types';
import { getChooseTractateAutocompleteStyles, getChooseMishnaTextFieldStyles } from './NavigationDropdownStyles';

interface Props {
  tractate: string;
  onSelectTractate: (tractate: iTractate) => void;
  allTractates?: iTractate[];
}

const ChooseTractate = (props: Props) => {
  const { tractate, onSelectTractate, allTractates } = props;
  const [selectedTractate, setSelectedTractate] = useState<iTractate | null>(null);

  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';

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
    <Autocomplete
      sx={getChooseTractateAutocompleteStyles(isHebrew)}
      onChange={_onChange}
      value={selectedTractate}
      options={allTractates || []}
      autoHighlight={true}
      getOptionLabel={(option) => isHebrew ? option.title_heb : formatTractateName(option.id)}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label={t('Tractate')} 
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
  );
};

export default ChooseTractate;
