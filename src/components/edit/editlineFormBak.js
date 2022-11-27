import React, { useState } from 'react';
import * as Yup from 'yup';
import { withFormik, FieldArray, Field, useField } from 'formik';
import MyFieldEditor from './MyFieldEditor';
import synopsisForm from './synopsisForm';
import FieldMainLineEditor from './MainLineEditor/MainLineEditor';
import { EditorState, ContentState } from 'draft-js';
import SourceButtons from './MainLineEditor/SourceButtons';
import SynopsisField from './MainLineEditor/SynopsisField';

const emptyItem = {
  text: {
    main: '',
    styled: '',
  },
  synopsis: [],
};

const formikEnhancer = withFormik({
  mapPropsToValues: (props) => {
    const { line, tractateSettings, mainLine } = props;

    return {
      mainLine: EditorState.createWithContent(ContentState.createFromText(mainLine || '')),
      sublines: [],
    };
  },
  validationSchema: Yup.object().shape({
    // email: Yup.string().email("That's not an email").required("Required!"),
  }),
  handleSubmit: (values, { setSubmitting }) => {
    setTimeout(() => {
      // you probably want to transform draftjs state to something else, but I'll leave that to you.
      console.log('submitted ', values);
      // alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 1000);
  },
  displayName: 'MyForm',
  enableReinitialize: true,
});

const EditLineForm = ({
  values,
  touched,
  dirty,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  handleReset,
  setFieldValue,
  isSubmitting,
  tractateSettings,
}) => {
  const [selectedSynopsis, setSelectedSynopsis] = useState([]);
  const changeSublines = (e) => {
    console.log('change sub', e);
    // check value of field
    console.log('values', values.mainLine);
    console.log('values sublines', values.sublines);
    setFieldValue('sublines', e);
  };
  const onChangeSynopsis = (e) => {
    setSelectedSynopsis([...selectedSynopsis, e.button_code]);
  };
  return (
    <form onSubmit={handleSubmit}>
      <FieldMainLineEditor name="mainLine" changeSublines={changeSublines}></FieldMainLineEditor>
      <SourceButtons
        tractateSettings={tractateSettings}
        selectedSynopsis={selectedSynopsis}
        onChange={(e) => onChangeSynopsis(e)}
      ></SourceButtons>
      <FieldArray
        name="sublines"
        render={(arrayHelpers) => (
          <div>
            {values.sublines.map((subline, index) => (
              <div key={index}>
                <br></br>
                <p style={{ direction: 'rtl', fontWeight: 'bold' }}>תת שורה</p>
                <p style={{ direction: 'rtl' }}>{subline}</p>
                {selectedSynopsis.map((synopsis_code, b) => {
                  const synopsis = tractateSettings.synopsisList[synopsis_code];
                  return <SynopsisField name={`sublines[${index}].text`} synopsis={synopsis} label={synopsis.name} />;
                })}
                {/* <Field name={`sublines[${index}].text`} /> */}
                {/* <MyFieldEditor 
              name={`sublines[${index}].text`} 
              label={`תת שורה ${index+1} `}/> */}
              </div>
            ))}
          </div>
        )}
      />

      <button type="button" className="outline" onClick={handleReset} disabled={!dirty || isSubmitting}>
        Reset
      </button>
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
};

export default formikEnhancer(EditLineForm);
