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
  console.log('ContentField', fieldValue);
  return (
    <>
      <div>
        {fieldValue.content.map((f,i) => {
          if (isFieldText(f)) {
            return <TextField key={i} fieldValue={f} />;
          }
          if (isHyperlink(f)) {
            return <HyperLinkField key={i} fieldValue={f} />;
          }
        })}
      </div>
      {/* <div>{fieldName}</div>
        <div>{JSON.stringify(fieldValue)}</div> */}
      {/* <div>{fieldName}</div>
        <div>{JSON.parse(fieldValue)}</div> */}
    </>
  );
};

export default ParagraphField;
