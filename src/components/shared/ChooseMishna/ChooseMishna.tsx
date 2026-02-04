import React, { useState, useEffect, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { getTractate, getChapter, getMishna } from '../../../inc/mishnaUtils';
import { hebrewMap } from '../../../inc/utils';
import { leanChapter } from './ChooseChapter';
import NavigationService from '../../../services/NavigationService';
import { iMarker, refMishna } from '../../../types/types';
import { getChooseMishnaAutocompleteStyles, getChooseMishnaTextFieldStyles, formatNumericId } from './NavigationDropdownStyles';
import { leanLine } from './ChooseLine';
import NavigationAutocomplete from './NavigationAutocomplete';
import { useIsHebrew } from './navigationTypes';

export interface iMishnaForNavigation extends refMishna {
  lines: leanLine[];
  previous?: iMarker;
  next?: iMarker;
  daf?: string;
  amud?: string;
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
  onUserSelectMishna?: (mishna: iMishnaForNavigation) => void; // Called only on user clicks
}

const ChooseMishna = (props: Props) => {
  const { mishnaName, onSelectMishna, inChapter, allChapterAllowed, onUserSelectMishna } = props;
  const [selectedMishna, setSelectedMishna] = useState<refMishna | null>(null);
  const [mishnaiot, setMishnaiot] = useState<refMishna[] | []>([]);
  const { t } = useTranslation();
  const isHebrew = useIsHebrew();

  const _onChange = (event: SyntheticEvent<Element, Event>, mishna: refMishna | null) => {
    if (!mishna) {
      return;
    }
    if (mishna.id === ALL_CHAPTER.id) {
      onSelectMishna(ALL_CHAPTER);
      // Call user-specific callback if provided
      if (onUserSelectMishna) {
        onUserSelectMishna(ALL_CHAPTER);
      }
      return;
    }
    const tractateName = getTractate(mishna);
    const chapterName = getChapter(mishna);
    const mishnaName = mishna.mishna || getMishna(mishna);
    fetchLines(tractateName, chapterName, mishnaName).then((m) => {
      onSelectMishna(m);
      // Call user-specific callback if provided
      if (onUserSelectMishna) {
        onUserSelectMishna(m);
      }
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

    // If mishnaName is empty, clear selection to show placeholder
    if (mishnaName === '') {
      setSelectedMishna(null);
      return;
    }

    //2. update selected mishna if found (including ALL_CHAPTER if mishnaName is 'all')
    const found = mishnaiotOptions.find((m) => m.mishna === mishnaName);
    if (found) {
      setSelectedMishna(found);

      const tractateName = getTractate(found);
      const chapterName = getChapter(found);
      const mishnaName = found.mishna || getMishna(found);
      fetchLines(tractateName, chapterName, mishnaName).then((m) => {
        onSelectMishna(m);
      });
    }
  }, [inChapter, mishnaName, allChapterAllowed]);

  return (
    <NavigationAutocomplete
      label="Halakha"
      value={selectedMishna}
      options={mishnaiot}
      getOptionLabel={(option) => {
        if (option.mishna === 'all') {
          return t('The whole chapter');
        }
        return isHebrew ? (hebrewMap.get(option.mishna) as string) : formatNumericId(option.mishna);
      }}
      isOptionEqualToValue={(option, value) => option.mishna === value.mishna}
      onChange={_onChange}
      customSx={getChooseMishnaAutocompleteStyles(isHebrew)}
      customTextFieldSx={getChooseMishnaTextFieldStyles(isHebrew)}
    />
  );
};

export default ChooseMishna;
