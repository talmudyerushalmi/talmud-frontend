import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { iTractate, refMishna } from '../../../types/types';
import { hebrewMap } from '../../../inc/utils';
import { getChooseMishnaAutocompleteStyles, getChooseMishnaTextFieldStyles, formatNumericId } from './NavigationDropdownStyles';

export interface leanChapter {
  id: string;
  mishnaiot: refMishna[];
}

interface Props {
  chapter: string;
  inTractate: iTractate | null;
  onSelectChapter: (tractate: leanChapter) => void;
  onUserSelectChapter?: (tractate: leanChapter) => void; // Called only on user clicks
}

const ChooseChapter = (props: Props) => {
  const { chapter, onSelectChapter, inTractate, onUserSelectChapter } = props;
  const [selectedChapter, setSelectedChapter] = useState<leanChapter | null>(null);

  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';

  const _onChange = (event: SyntheticEvent<Element, Event>, chapter: leanChapter | null) => {
    if (chapter) {
      onSelectChapter(chapter);
      // Call the user-specific callback if provided
      if (onUserSelectChapter) {
        onUserSelectChapter(chapter);
      }
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
        sx={getChooseMishnaAutocompleteStyles(isHebrew)}
        onChange={_onChange}
        value={selectedChapter}
        options={inTractate?.chapters || []}
        autoHighlight={true}
        getOptionLabel={(option) => isHebrew ? (hebrewMap.get(option.id) as string) : formatNumericId(option.id)}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label={t('Chapter')} 
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

export default ChooseChapter;
