import React, { useState } from "react";
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
  return (
    <>
      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={isNewSugia}
              onChange={() => {
                if (isNewSugia) {
                  setValue(undefined);
                }
                setIsNewSugia(!isNewSugia);
              }}
            />
          }
          label="סוגיה חדשה"
        />

        <TextField
          fullWidth
          {...field}
          disabled={!isNewSugia}
          placeholder="שם הסוגיה"
        />
      </Box>
    </>
  );
};
export default SugiaField;
