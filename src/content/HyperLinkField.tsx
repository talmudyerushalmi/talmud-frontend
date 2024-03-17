import React from 'react';
import {
  ContentDocument,
  ContentHyperLinkField,
  ContentTextField,
  isFieldDocument,
  isFieldParagraph,
  isFieldText,
} from './types';
import TextField from './TextField';

interface Props {
  fieldValue: ContentHyperLinkField;
  heading?: boolean
}

const HyperLinkField = (props: Props) => {
  const { fieldValue, heading } = props
  const content = fieldValue.content[0];
  return (
    <>
      <a href={fieldValue.data.uri} style={{textDecoration:'none', color:'inherit'}}>{isFieldText(content) ? <TextField heading={heading} fieldValue={content} /> : null}</a>
    </>
  );
};

export default HyperLinkField;
