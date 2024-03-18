import React from 'react';
import { ContentDocument, ContentTextField, isFieldDocument, isFieldParagraph, isFieldText } from './types';
import { Typography } from '@mui/material';

interface Props {
  fieldValue: ContentTextField;
  heading?: boolean;
}

const TextField = (props: Props) => {
  const { fieldValue, heading } = props;
  if (fieldValue.value=="") return null
  return (
    <>
      {heading ? <Typography variant={'h6'}>{fieldValue.value}</Typography> : <span>{fieldValue.value}</span>}
    </>
  );
};

export default TextField;
