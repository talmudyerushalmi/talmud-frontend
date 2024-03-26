import React from 'react';
import { ContentDocument, ContentTextField, isFieldDocument, isFieldParagraph, isFieldText } from './types';
import { Typography } from '@mui/material';

interface Props {
  fieldValue: ContentTextField;
  heading?: string;
}

const TextField = (props: Props) => {
  const { fieldValue, heading } = props;
  if (fieldValue.value == '') return null;
  const variant = `h${heading}`;
  return (
    <>
      {
        //@ts-ignore
        heading ? <Typography variant={variant}>{fieldValue.value}</Typography> : <span>{fieldValue.value}</span>
      }
    </>
  );
};

export default TextField;
