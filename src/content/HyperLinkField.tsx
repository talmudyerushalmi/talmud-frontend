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
}

const HyperLinkField = (props: Props) => {
  const { fieldValue } = props;
  const content = fieldValue.content[0];
  return (
    <>
      <a href={fieldValue.data.uri}>{isFieldText(content) ? <TextField fieldValue={content} /> : null}</a>
    </>
  );
};

export default HyperLinkField;
