import React, { useEffect, useState } from "react";
import { useField } from "formik";
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@material-ui/core";

interface Props {
  name: string;
}

const SugiaField = (props: Props) => {
  const [field, meta, helpers] = useField(props);
  const { setValue } = helpers;
  const { value } = meta;
  const [isNewSugia, setIsNewSugia] = useState(!!value);
  const [sugiaName, setSugiaName] = useState(value);
  useEffect(()=>{
    setIsNewSugia(!!value)
    if (value) {
      setSugiaName(value)
    } else {
      setSugiaName("")
    }
  }, [value])
  const checkboxHandler = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const checkNewVal = e.target.checked;
      if (isNewSugia) {
        setValue("");
      }
      setIsNewSugia(checkNewVal);
  }
  return (
    <>
      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={isNewSugia}
              onChange={checkboxHandler}
            />
          }
          label="סוגיה חדשה"
        />
        <TextField
          fullWidth
          value={sugiaName}
          onChange={(e)=>setValue(e.target.value)}
          disabled={!isNewSugia}
          placeholder="שם הסוגיה"
        />
      </Box>
    </>
  );
};
export default SugiaField;
