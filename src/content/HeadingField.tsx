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

const HeadingField = (props: Props) => {
  const { fieldValue } = props;
  console.log('ContentField', fieldValue);
  return (
    <>
      <div>
        heading
        {fieldValue.content.map((f) => {
          if (isFieldText(f)) {
            return <TextField fieldValue={f} />;
          }
          if (isHyperlink(f)) {
            return <HyperLinkField fieldValue={f} />;
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

export default HeadingField;
