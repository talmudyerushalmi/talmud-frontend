import React from 'react';
import {
  ContentDocument,
  ContentParagraphField,
  isFieldDocument,
  isFieldParagraph,
  isFieldText,
  isHyperlink,
} from './types';
import TextField from './TextField';
import HyperLinkField from './HyperLinkField';

interface Props {
  fieldValue: ContentParagraphField;
}

const ParagraphField = (props: Props) => {
  const { fieldValue } = props;
  return (
    <>
      <div>
        {fieldValue.content.map((f, i) => {
          if (isFieldText(f)) {
            return <TextField key={i} fieldValue={f} />;
          }
          if (isHyperlink(f)) {
            return <HyperLinkField key={i} fieldValue={f} />;
          }
        })}
      </div>
    </>
  );
};

export default ParagraphField;
