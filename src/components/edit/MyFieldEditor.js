import React from 'react';
import { useField } from 'formik';
import TextEditor from './SynopsisTextEditor';

const MyFieldEditor = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props.name);
  const { value } = meta;
  // if (!value || !value.main) {
  //   helpers.setValue( {
  //     main: "",
  //     styled: ""
  //   })
  // }

  const { main, styled } = value;
  //const { text } = value;

  // const [text, setText] = useState("startText");

  const changeE = (a) => {
    console.log('change editor ', a);
    helpers.setValue(a.main);
  };

  return (
    <>
      <div style={{}}>
        <label>{label}</label>
        {/* <input {...field} {...props}  type="hidden"/> */}
        <TextEditor value={main} onChange={changeE} />
      </div>
    </>
  );
};

export default MyFieldEditor;
