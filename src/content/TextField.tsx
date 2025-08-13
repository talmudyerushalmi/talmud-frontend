import React from 'react';
import { ContentDocument, ContentTextField, isFieldDocument, isFieldParagraph, isFieldText } from './types';
import { Typography } from '@mui/material';

interface Props {
  fieldValue: ContentTextField;
  heading?: string;
}

const TextField = (props: Props) => {
  const { fieldValue,  heading } = props;
  if (fieldValue.value == '') return null;
  const isBold = fieldValue.marks?.some(mark => mark.type === 'bold')
  const variant = `h${heading}`;
  if (heading) {
    //@ts-ignore
    return <Typography variant={variant} fontWeight={isBold ? 'bold' : undefined}>{fieldValue.value}</Typography> 
  } else return <Typography 
   component="span" fontWeight={isBold ? 'bold' : undefined}>
    {fieldValue.value}
    </Typography>
};

export default TextField;
