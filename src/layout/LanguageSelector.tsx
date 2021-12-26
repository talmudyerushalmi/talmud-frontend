import { MenuItem, Select } from "@material-ui/core";
import * as React from "react";
import i18next from "i18next";

const LanguageSelector = () => {
  const [language, setLanguage] = React.useState(i18next.language);

  const handleChange = (event) => {
    const lang = event.target.value;
    document.cookie = "i18next=" + lang;
    i18next.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <Select
      value={language}
      onChange={handleChange}
      disableUnderline
      inputProps={{ "aria-label": "Without label" }}
    >
      <MenuItem value={"en-US"}>EN</MenuItem>
      <MenuItem value={"he"}>HE</MenuItem>
    </Select>
  );
};

export default LanguageSelector;
