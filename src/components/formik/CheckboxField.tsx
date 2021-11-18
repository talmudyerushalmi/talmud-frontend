import React, { useEffect, useState } from "react";
import { Checkbox, FormControlLabel, Typography } from "@material-ui/core";
import { useField } from "formik";

interface Props {
    name: string;

}
const CheckboxField = (props: Props) => {
    const [_, meta, helpers] = useField(props);
    const { setValue } = helpers;
    const { value } = meta;
    const [checked, setChecked] = useState(!!value);
  
    useEffect(() => {
        setChecked(value);
    }, [value]);
  
    const checkboxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checkNewVal = e.target.checked;
      setValue(checkNewVal);
    };
    return (
      <>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={checkboxHandler} />}
            label={<Typography>פיסקה</Typography>}
          />
      </>
    );
  };

  export default CheckboxField;