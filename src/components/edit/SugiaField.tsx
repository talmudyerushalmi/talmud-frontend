import React, { useEffect, useState } from 'react';
import { useField } from 'formik';
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';

interface Props {
  name: string;
}

const SugiaField = (props: Props) => {
  const [, meta, helpers] = useField(props);
  const { setValue, setTouched } = helpers;
  const { value, touched } = meta;
  const [hasValue, setHasValue] = useState(!!value);

  const [val, setVal] = useState(value);

  useEffect(() => {
    if (touched === false) {
      setHasValue(Boolean(value));
    }
    setVal(value ? value : '');
  }, [touched, value]);

  const checkboxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkNewVal = e.target.checked;
    if (value) {
      setValue('');
    }
    setTouched(true);
    setHasValue(checkNewVal);
  };

  const mySetValue = (e) => {
    setVal(e);
  };
  const setFormik = () => {
    setValue(val);
  };

  return (
    <>
      <Box style={{ display: 'flex' }}>
        <FormControlLabel control={<Checkbox checked={hasValue} onChange={checkboxHandler} />} label="סוגיה חדשה" />
        <TextField
          style={{ padding: '9px' }}
          value={val}
          onChange={(e) => mySetValue(e.target.value)}
          onBlur={setFormik}
          disabled={!hasValue}
          placeholder="שם הסוגיה"
          size="small"
          margin="none"
          sx={{
            '& .MuiOutlinedInput-input': {
              padding: '5px 10px',
            },
          }}
        />
      </Box>
    </>
  );
};
export default SugiaField;
