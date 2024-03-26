import React from 'react';
import { ContentDocument, isEmbeddedAssetBlock, isFieldParagraph, isHR, isHeading } from './types';
import ParagraphField from './ParagraphField';
import HeadingField from './HeadingField';
import HRField from './HRField';
import EmbeddedAssetBlock from './EmbeddedAssetBlock';

interface Props {
  fieldValue: ContentDocument;
}

const DocumentField = (props: Props) => {
  const { fieldValue } = props;
  return (
    <>
      <div>
        {fieldValue.content.map((f, i) => {
          if (isFieldParagraph(f)) {
            return <ParagraphField key={i} fieldValue={f} />;
          }
          if (isHeading(f)) {
            return <HeadingField key={i} fieldValue={f} />;
          }
          if (isHR(f)) {
            return <HRField key={i}/>;
          }
          if (isEmbeddedAssetBlock(f)) {
            return <EmbeddedAssetBlock fieldValue={f} key={i}/>;
          }
        })}
      </div>
    </>
  );
};

export default DocumentField;
