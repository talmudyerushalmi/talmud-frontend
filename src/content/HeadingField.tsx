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
  const regexp = /heading-(\d+)/g;
  const text = fieldValue.nodeType
  const headingSize = [...text.matchAll(regexp)][0][1];
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        {fieldValue.content.map((f, i) => {
          if (isFieldText(f)) {
            return <TextField heading={headingSize} key={i} fieldValue={f} />;
          }
          if (isHyperlink(f)) {
            return <HyperLinkField heading={headingSize} key={i} fieldValue={f} />;
          }
        })}
      </div>
    </>
  );
};

export default HeadingField;
