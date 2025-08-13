import React from 'react';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useController, Control } from 'react-hook-form';

interface Props {
  name: string;
  control: Control<any>;
}

const CheckboxFieldRHF = (props: Props) => {
  const { name, control } = props;
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
    defaultValue: false,
  });

  const checkboxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
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

export default CheckboxFieldRHF;