import React, { useState, useEffect, SyntheticEvent } from 'react';
import { iTractate, refMishna } from '../../../types/types';
import { hebrewMap } from '../../../inc/utils';
import { getChooseMishnaAutocompleteStyles, getChooseMishnaTextFieldStyles, formatNumericId } from './NavigationDropdownStyles';
import NavigationAutocomplete from './NavigationAutocomplete';
import { useIsHebrew } from './navigationTypes';

export interface leanChapter {
  id: string;
  mishnaiot: refMishna[];
}

interface Props {
  chapter: string;
  inTractate: iTractate | null;
  onSelectChapter: (tractate: leanChapter) => void;
}

const ChooseChapter = (props: Props) => {
  const { chapter, onSelectChapter, inTractate } = props;
  const [selectedChapter, setSelectedChapter] = useState<leanChapter | null>(null);

  const isHebrew = useIsHebrew();

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
    <NavigationAutocomplete
      label="Chapter"
      value={selectedChapter}
      options={inTractate?.chapters || []}
      getOptionLabel={(option) => isHebrew ? (hebrewMap.get(option.id) as string) : formatNumericId(option.id)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={_onChange}
      customSx={getChooseMishnaAutocompleteStyles(isHebrew)}
      customTextFieldSx={getChooseMishnaTextFieldStyles(isHebrew)}
    />
  );
};

export default ChooseChapter;
