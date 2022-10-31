import React from 'react';
import { useField } from 'formik';
import RichTextEditor from './RichTextEditor';

interface Props {
  name: string;
  label: string;
}

const RichTextEditorField = (props: Props) => {
  const { label } = props;
  const [field, meta, helpers] = useField(props);
  const { value } = meta;

  const changeEditorState = (editorState) => {
    helpers.setValue(editorState);
  };

  return (
    <>
      <div style={{}}>
        <label>{label}</label>
        <RichTextEditor editorState={value} onChange={changeEditorState} />
      </div>
    </>
  );
};

export default RichTextEditorField;
