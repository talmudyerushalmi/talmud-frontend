import { Typography } from '@mui/material';
import React from 'react';
import { clearPunctutationFromText, hideSourceFromText } from '../../inc/synopsisUtils';

const UndividedText = (props) => {
  const { lines, showPunctuation, showSources } = props;
  const sublines = lines
    ?.reduce((acc, line) => {
      acc.push(line.sublines);
      return acc;
    }, [])
    .flat();
  let text = sublines?.reduce((acc, l) => acc + l.text, '');
  if (!showSources) {
    text = hideSourceFromText(text);
  }
  if (!showPunctuation) {
    text = clearPunctutationFromText(text);
  }
  return (
    <>
      <Typography style={{ textAlign: 'right' }}>{text}</Typography>
    </>
  );
};
export default UndividedText;
