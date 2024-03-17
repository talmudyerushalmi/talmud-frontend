import React from 'react';
import { isFieldDocument } from './types';
import DocumentField from './DocumentField';

interface Props {
  fieldName: string;
  fieldValue: any;
}

const ContentField = (props: Props) => {
  const { fieldName, fieldValue } = props;
  console.log('ContentField', fieldName, fieldValue);
  return <>{isFieldDocument(fieldValue) ? <DocumentField fieldValue={fieldValue} /> : null}</>;
};

export default ContentField;
