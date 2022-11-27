import React, { useEffect, useState } from 'react';
import { useField } from 'formik';
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';

interface Props {
  name: string;
}

const SugiaField = (props: Props) => {
  const [_, meta, helpers] = useField(props);
  const { setValue, setTouched } = helpers;
  const { value, touched } = meta;
  const [hasValue, setHasValue] = useState(!!value);
  const [fieldName, setfieldName] = useState(value);

  useEffect(() => {
    if (touched === false) {
      setHasValue(value !== '');
    }
    setfieldName(value);
  }, [touched, value]);

  const checkboxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkNewVal = e.target.checked;
    if (value) {
      setValue('');
    }
    setTouched(true);
    setHasValue(checkNewVal);
  };
  return (
    <>
      <Box style={{ display: 'flex' }}>
        <FormControlLabel control={<Checkbox checked={hasValue} onChange={checkboxHandler} />} label="סוגיה חדשה" />
        <TextField
          style={{ padding: '9px' }}
          value={fieldName}
          onChange={(e) => setValue(e.target.value)}
          disabled={!hasValue}
          placeholder="שם הסוגיה"
        />
      </Box>
    </>
  );
};
export default SugiaField;
