import React, { SyntheticEvent, useEffect, useState } from 'react';
import { iMishnaForNavigation } from './ChooseMishna';
import NavigationAutocomplete from './NavigationAutocomplete';

export interface leanLine {
  lineNumber: string;
  mainLine: string;
}

interface Props {
  lineNumber: string;
  mishnaData: iMishnaForNavigation | null;
  onSelectLine: (line: leanLine) => void;
}

const ChooseLine = (props: Props) => {
  const { mishnaData, lineNumber, onSelectLine } = props;
  const [selectedLine, setSelectedLine] = useState<leanLine | null>(null);

  const _onChange = (event: SyntheticEvent<Element, Event>, line: leanLine | null) => {
    if (line) {
      onSelectLine(line);
    }
  };

  useEffect(() => {
    const found = mishnaData?.lines.find((l) => l.lineNumber === lineNumber);
    // Only update if we actually found the line - don't fall back to first line
    if (found) {
      setSelectedLine(found);
      onSelectLine(found);
    } else if (!lineNumber && mishnaData?.lines?.[0]) {
      // Only use first line as fallback if no lineNumber was specified
      setSelectedLine(mishnaData.lines[0]);
      onSelectLine(mishnaData.lines[0]);
    }
  }, [mishnaData, lineNumber]);

  return (
    <NavigationAutocomplete
      label="Line"
      value={selectedLine}
      options={mishnaData ? mishnaData.lines : []}
      getOptionLabel={(option) => option.lineNumber + ' ' + option.mainLine || ''}
      isOptionEqualToValue={(option, value) => option.lineNumber === value.lineNumber}
      onChange={_onChange}
      customSx={{
        minWidth: 100,
        flex: 'auto',
        '&.MuiAutocomplete-root  .MuiOutlinedInput-root .MuiAutocomplete-input': {
          padding: 0,
        },
      }}
      customListboxProps={{ textAlign: 'right' }}
      inputLabelProps={{ shrink: true }}
    />
  );
};

export default ChooseLine;
