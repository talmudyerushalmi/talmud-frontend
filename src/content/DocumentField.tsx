import React from 'react';
import { ContentDocument, isFieldDocument, isFieldParagraph, isHeading } from './types';
import ParagraphField from './ParagraphField';
import HeadingField from './HeadingField';

interface Props {
  fieldValue: ContentDocument;
}

const DocumentField = (props: Props) => {
  const { fieldValue } = props;
  console.log('ContentField', fieldValue);
  return (
    <>
      <div>
        {fieldValue.content.map((f) => {
          if (isFieldParagraph(f)) {
            return <ParagraphField fieldValue={f} />;
          }
          if (isHeading(f)) {
            return <HeadingField fieldValue={f} />;
          }
        })}
      </div>
    </>
  );
};

export default DocumentField;
