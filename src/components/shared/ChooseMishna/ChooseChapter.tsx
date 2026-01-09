import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { iTractate, refMishna } from '../../../types/types';
import { hebrewMap } from '../../../inc/utils';

export interface leanChapter {
  id: string;
  mishnaiot: refMishna[];
}

interface Props {
  chapter: string;
  inTractate: iTractate | null;
  onSelectChapter: (tractate: leanChapter) => void;
  isHebrew: boolean;
}

const ChooseChapter = (props: Props) => {
  const { chapter, onSelectChapter, inTractate, isHebrew } = props;
  const [selectedChapter, setSelectedChapter] = useState<leanChapter | null>(null);

  const { t } = useTranslation();

  const _onChange = (event: SyntheticEvent<Element, Event>, chapter: leanChapter | null) => {
    if (chapter) {
      onSelectChapter(chapter);
    }
  };

  useEffect(() => {
    const found = inTractate?.chapters.find((c) => c.id === chapter);
    if (found) {
      setSelectedChapter(found);
      onSelectChapter(found);
    }
  }, [inTractate, chapter]);

  return (
    <>
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
        value={selectedChapter}
        options={inTractate?.chapters || []}
        autoHighlight={true}
        getOptionLabel={(option) => isHebrew ? (hebrewMap.get(option.id) as string) : option.id}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label={t('Chapter')} 
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
    </>
  );
};

export default ChooseChapter;
