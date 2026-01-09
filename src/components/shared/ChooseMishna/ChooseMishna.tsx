import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getTractate, getChapter, getMishna } from '../../../inc/mishnaUtils';
import { hebrewMap } from '../../../inc/utils';
import { leanChapter } from './ChooseChapter';
import NavigationService from '../../../services/NavigationService';
import { iMarker, refMishna } from '../../../types/types';
import { leanLine } from './ChooseLine';

export interface iMishnaForNavigation extends refMishna {
  lines: leanLine[];
  previous?: iMarker;
  next?: iMarker;
}

export const ALL_CHAPTER: iMishnaForNavigation = {
  id: 'all',
  mishna: 'all',
  lines: [],
};

interface Props {
  mishnaName: string;
  allChapterAllowed?: boolean;
  inChapter: leanChapter | null;
  onSelectMishna: (mishna: iMishnaForNavigation) => void;
  isHebrew: boolean;
}

const ChooseMishna = (props: Props) => {
  const { mishnaName, onSelectMishna, inChapter, allChapterAllowed, isHebrew } = props;
  const [selectedMishna, setSelectedMishna] = useState<refMishna | null>(null);
  const [mishnaiot, setMishnaiot] = useState<refMishna[] | []>([]);
  const { t } = useTranslation();

  const _onChange = (event: SyntheticEvent<Element, Event>, mishna: refMishna | null) => {
    if (!mishna) {
      return;
    }
    if (mishna.id === ALL_CHAPTER.id) {
      onSelectMishna(ALL_CHAPTER)
      return;
    }
    const tractateName = getTractate(mishna);
    const chapterName = getChapter(mishna);
    const mishnaName = mishna.mishna || getMishna(mishna);
    fetchLines(tractateName, chapterName, mishnaName).then((m) => {
      onSelectMishna(m);
    });
  };


  const fetchLines = (tractate: string, chapter: string, mishna: string) => {
    if (tractate === ALL_CHAPTER.id) {
      return Promise.resolve(ALL_CHAPTER);
    }
    const controller = new AbortController();
    return NavigationService.getMishnaForNavigation(tractate, chapter, mishna, controller);
  };

  useEffect(() => {
    let mishnaiotOptions = inChapter?.mishnaiot ? [...inChapter?.mishnaiot] : [];
    if (allChapterAllowed) {
      mishnaiotOptions.push(ALL_CHAPTER);
    }
    //1. update options from chapter data
    setMishnaiot(mishnaiotOptions);

    let found = mishnaiotOptions.find((m) => m.mishna === mishnaName);
    if (mishnaName === '' && allChapterAllowed) {
      found = ALL_CHAPTER;
    }
    //2. update selected mishna if found
    if (found) {
      setSelectedMishna(found);

      const tractateName = getTractate(found);
      const chapterName = getChapter(found);
      const mishnaName = found.mishna || getMishna(found);
      fetchLines(tractateName, chapterName, mishnaName).then((m) => {
        onSelectMishna(m);
      });
    }
  }, [inChapter, mishnaName]);

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
        value={selectedMishna}
        options={mishnaiot}
        autoHighlight={true}
        getOptionLabel={(option) => isHebrew ? (hebrewMap.get(option.mishna) as string) : option.mishna}
        isOptionEqualToValue={(option, value) => option.mishna === value.mishna}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label={t('Halakha')} 
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

export default ChooseMishna;
