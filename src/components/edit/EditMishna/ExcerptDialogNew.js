import React, { useState } from 'react';
import { withFormik, Field } from 'formik';
import { Grid, DialogActions, Button } from '@mui/material';

const formikEnhancer = withFormik({
  mapPropsToValues: (props) => {
    const { line, tractateSettings, mainLine, onSubmitted } = props;
    return {
      text: 'try',
    };
  },
  handleSubmit: (values, { setSubmitting, props }) => {
    const { onSubmitted } = props;
    setTimeout(() => {
      // you probably want to transform draftjs state to something else, but I'll leave that to you.
      console.log('submitted ', values);
      // alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
      onSubmitted();
    }, 1000);
  },
  displayName: 'MyForm',
  enableReinitialize: true,
});

const ExcerptDialogNew = ({
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
  test,
}) => {
  const [selectedSynopsis, setSelectedSynopsis] = useState([]);
  return (
    <form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={12}>
          <Field name={`text`} />
          {/* <FormControlLabel
            style={{ marginRight: 0 }}
            control={<Checkbox checked={checked} onChange={handleChange} />}
            label="ראו?"
          /> */}
        </Grid>
      </Grid>
      <DialogActions>
        <Button
          type="button"
          className="outline"
          onClick={handleReset}
          disabled={!dirty || isSubmitting}
          color="primary"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} color="primary">
          הוסף
        </Button>
      </DialogActions>
    </form>
  );
};
export default formikEnhancer(ExcerptDialogNew);
