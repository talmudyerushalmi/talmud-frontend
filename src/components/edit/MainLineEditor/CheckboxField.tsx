import React from 'react';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useField } from 'formik';

interface Props {
  name: string;
}
const CheckboxField = (props: Props) => {
  const [, meta, helpers] = useField({
    name: props.name,
    type: "checkbox"
  });
  const { setValue } = helpers;
  const { value } = meta;

  const checkboxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkNewVal = e.target.checked;
    setValue(checkNewVal);
  };
  return (
    <>
      <FormControlLabel
        control={<Checkbox checked={value} onChange={checkboxHandler} />}
        label={<Typography>פיסקה</Typography>}
      />
    </>
  );
};

export default CheckboxField;
