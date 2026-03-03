import React, { useEffect, useState } from 'react';
import { useController, Control } from 'react-hook-form';
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';

interface Props {
  name: string;
  control: Control<any>;
}

const SubSugiaField = (props: Props) => {
  const { name, control } = props;
  const {
    field: { value, onChange, onBlur },
    fieldState: { isTouched },
  } = useController({
    name,
    control,
  });

  const [hasValue, setHasValue] = useState(!!value);
  const [val, setVal] = useState(value || '');

  useEffect(() => {
    if (!isTouched) {
      // hasValue is true if value is defined (even if empty string)
      setHasValue(value !== undefined && value !== null);
    }
    setVal(value !== undefined && value !== null ? value : '');
  }, [isTouched, value]);

  const checkboxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkNewVal = e.target.checked;
    if (checkNewVal) {
      // Checkbox checked - save empty string
      onChange('');
      setVal('');
    } else {
      // Checkbox unchecked - save undefined
      onChange(undefined);
      setVal('');
    }
    setHasValue(checkNewVal);
  };

  const mySetValue = (e: string) => {
    setVal(e);
  };

  const setFormValue = () => {
    // Validate: if checkbox is checked, must have at least 1 character
    if (hasValue && val.trim().length === 0) {
      // Show error or prevent saving - for now just don't save empty
      return;
    }
    onChange(val);
    onBlur();
  };

  return (
    <>
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel control={<Checkbox checked={hasValue} onChange={checkboxHandler} />} label="תת-סוגיה חדשה" />
        <TextField
          style={{ padding: '9px' }}
          value={val}
          onChange={(e) => mySetValue(e.target.value)}
          onBlur={setFormValue}
          disabled={!hasValue}
          placeholder={hasValue ? "שם תת-הסוגיה (1-4 תווים)" : "שם תת-הסוגיה"}
          size="small"
          margin="none"
          inputProps={{ maxLength: 4 }}
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
export default SubSugiaField;
