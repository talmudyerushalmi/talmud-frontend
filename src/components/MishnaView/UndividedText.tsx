import { Typography, useTheme } from '@mui/material';
import React, { FC } from 'react';
import { clearPunctutationFromText, hideSourceFromText } from '../../inc/synopsisUtils';
import { iLine, iSubline } from '../../types/types';

interface Props {
  lines: iLine[];
  showPunctuation: boolean;
  // showSources: boolean;
}

const UndividedText: FC<Props> = (props) => {
  const { lines, showPunctuation, /* showSources */ } = props;
  const theme = useTheme();

  const sublines: iSubline[] = lines
    ?.reduce((acc, line) => {
      line.sublines && acc.push(line.sublines);
      return acc;
    }, [] as iSubline[][])
    ?.flat();

  let text = sublines?.reduce((acc, l) => acc + l.text + ' ', '');
  // if (!showSources) {
    text = hideSourceFromText(text);
  // }
  if (!showPunctuation) {
    text = clearPunctutationFromText(text);
  }
  return (
    <>
      <Typography style={{ textAlign: 'right' }}
      sx={{color: theme.palette.text.primary}}
      >{text}</Typography>
    </>
  );
};
export default UndividedText;
