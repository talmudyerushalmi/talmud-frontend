import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { iTractate } from '../../../types/types';

interface Props {
  tractate: string;
  onSelectTractate: (tractate: iTractate) => void;
  allTractates?: iTractate[];
  isHebrew: boolean;
}

const ChooseTractate = (props: Props) => {
  const { tractate, onSelectTractate, allTractates, isHebrew } = props;
  const [selectedTractate, setSelectedTractate] = useState<iTractate | null>(null);

  const { t } = useTranslation();

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
      sx={{
        minWidth: 100,
        flex: 1,
        direction: isHebrew ? 'rtl' : 'ltr',
        // Isolate from global RTL context
        ...(!isHebrew && {
          '& *': { direction: 'ltr' },
        }),
        '&.MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-input': {
          padding: 0,
        },
        '& .MuiAutocomplete-endAdornment': {
          left: isHebrew ? 'unset' : '7px',
          right: isHebrew ? '7px' : 'unset',
          display: 'flex',
          flexDirection: 'row-reverse',
        },
      }}
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
          sx={{ 
            '& .MuiInputBase-input': {
              textAlign: isHebrew ? 'left' : 'right',
              marginRight: isHebrew ? 0 : '-50px',
            },
            '& .MuiInputLabel-root': {
              left: isHebrew ? 0 : 'unset',
              right: isHebrew ? 'unset' : 30,
              transformOrigin: isHebrew ? 'top left' : 'top right',
            },
            '& .MuiOutlinedInput-notchedOutline legend': {
              textAlign: isHebrew ? 'left' : 'right',
            },
          }} 
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
