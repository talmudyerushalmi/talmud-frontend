import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useBiblicalDesign } from '../context/biblical-design-context';
import {
  BIBLICAL_NAV_OPTIONS,
  BiblicalNavVariant,
  getBiblicalNavChrome,
} from '../context/biblicalNavChrome';

/** Preview picker for header/footer palette — remove after final choice. */
const BiblicalNavChromeSelector: React.FC = () => {
  const { navVariant, setNavVariant } = useBiblicalDesign();
  const { i18n } = useTranslation();
  const isHe = i18n.language === 'he' || i18n.resolvedLanguage === 'he';
  const chrome = getBiblicalNavChrome(navVariant);

  const handleChange = (e: SelectChangeEvent<string>) => {
    setNavVariant(e.target.value as BiblicalNavVariant);
  };

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: { xs: 130, md: 168 },
        mx: 0.5,
        '& .MuiInputLabel-root': { color: chrome.foreground, fontSize: '0.75rem' },
        '& .MuiOutlinedInput-root': {
          color: chrome.foreground,
          fontSize: '0.8rem',
          '& fieldset': { borderColor: 'rgba(201, 162, 39, 0.45)' },
          '&:hover fieldset': { borderColor: 'rgba(212, 175, 55, 0.65)' },
        },
        '& .MuiSvgIcon-root': { color: chrome.foreground },
      }}>
      <InputLabel id="biblical-nav-label">גוון סרגלים</InputLabel>
      <Select
        labelId="biblical-nav-label"
        value={navVariant}
        label="גוון סרגלים"
        onChange={handleChange}
        MenuProps={{ disableScrollLock: true }}>
        {BIBLICAL_NAV_OPTIONS.map((opt) => (
          <MenuItem key={opt.id} value={opt.id} dense>
            {isHe ? opt.labelHe : opt.labelEn}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BiblicalNavChromeSelector;
