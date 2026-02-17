import React, { SyntheticEvent } from 'react';
import { Autocomplete, TextField, AutocompleteRenderInputParams } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useIsHebrew } from './navigationTypes';

interface NavigationAutocompleteProps<T> {
  label: string;
  value: T | null;
  options: T[];
  getOptionLabel: (option: T) => string;
  isOptionEqualToValue: (option: T, value: T) => boolean;
  onChange: (event: SyntheticEvent<Element, Event>, value: T | null) => void;
  customSx?: object;
  customTextFieldSx?: object;
  customListboxProps?: object;
  inputLabelProps?: object;
}

/**
 * Shared Autocomplete component for all navigation dropdowns
 * Reduces duplication across ChooseTractate, ChooseChapter, ChooseMishna, ChooseDaf, ChooseAmud, ChooseLine
 */
function NavigationAutocomplete<T>({
  label,
  value,
  options,
  getOptionLabel,
  isOptionEqualToValue,
  onChange,
  customSx = {},
  customTextFieldSx = {},
  customListboxProps = {},
  inputLabelProps = {},
}: NavigationAutocompleteProps<T>) {
  const { t } = useTranslation();
  const isHebrew = useIsHebrew();

  return (
    <Autocomplete
      sx={customSx}
      onChange={onChange}
      value={value}
      options={options}
      autoHighlight={true}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField 
          {...params} 
          label={t(label)} 
          variant="outlined" 
          sx={customTextFieldSx}
          InputLabelProps={inputLabelProps}
        />
      )}
      ListboxProps={{
        style: {
          direction: isHebrew ? 'rtl' : 'ltr',
          ...customListboxProps,
        },
      }}
    />
  );
}

export default NavigationAutocomplete;
