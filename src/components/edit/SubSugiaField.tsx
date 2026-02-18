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
      setHasValue(Boolean(value));
    }
    setVal(value ? value : '');
  }, [isTouched, value]);

  const checkboxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkNewVal = e.target.checked;
    if (value) {
      onChange('');
    }
    setHasValue(checkNewVal);
  };

  const mySetValue = (e: string) => {
    setVal(e);
  };

  const setFormValue = () => {
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
          placeholder={hasValue ? "שם תת-הסוגיה (עד 3 תווים)" : "שם תת-הסוגיה"}
          size="small"
          margin="none"
          inputProps={{ maxLength: 3 }}
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
