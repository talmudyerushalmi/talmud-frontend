import React from 'react';
import { ContentDocument, ContentTextField, isFieldDocument, isFieldParagraph, isFieldText } from './types';
import { Typography } from '@mui/material';

interface Props {
  fieldValue: ContentTextField;
  heading?: boolean;
}

const TextField = (props: Props) => {
  const { fieldValue, heading } = props;
  return (
    <>
      {heading} 
      <Typography variant={heading?'h2':'body1'}>{fieldValue.value}</Typography>
    </>
  );
};

export default TextField;
