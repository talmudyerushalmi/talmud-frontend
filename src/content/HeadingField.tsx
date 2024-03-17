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
      <div style={{textAlign:'center'}}>
        {fieldValue.content.map((f, i) => {
          if (isFieldText(f)) {
            return <TextField heading={true} key={i} fieldValue={f} />;
          }
          if (isHyperlink(f)) {
            return <HyperLinkField heading={true} key={i} fieldValue={f} />;
          }
        })}
      </div>
    </>
  );
};

export default HeadingField;
