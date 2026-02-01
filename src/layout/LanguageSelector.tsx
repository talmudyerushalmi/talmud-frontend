import { MenuItem, Select } from '@mui/material';
import * as React from 'react';
import i18next from 'i18next';

const LanguageSelector = () => {
  const [language, setLanguage] = React.useState(i18next.language);

  const handleChange = (event) => {
    const lang = event.target.value;
    document.cookie = 'i18next=' + lang;
    i18next.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <Select 
      value={language} 
      onChange={handleChange} 
      inputProps={{ 'aria-label': 'Language selector' }}
      sx={{
        color: '#ffd54f',
        fontSize: '0.95rem',
        fontWeight: 600,
        border: '1.5px solid #ffd54f',
        borderRadius: '6px',
        padding: '2px 8px',
        minWidth: '70px',
        backgroundColor: 'rgba(255, 213, 79, 0.12)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: 'rgba(255, 213, 79, 0.22)',
          borderColor: '#ffeb3b',
          color: '#ffeb3b',
        },
        '& .MuiSelect-select': {
          padding: '4px 8px',
          paddingRight: '32px !important',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '& .MuiSvgIcon-root': {
          color: '#ffd54f',
        },
      }}
    >
      <MenuItem value={'en-US'}>EN</MenuItem>
      <MenuItem value={'he'}>HE</MenuItem>
    </Select>
  );
};

export default LanguageSelector;
