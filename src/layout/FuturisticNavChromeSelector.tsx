import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFuturisticDesign } from '../context/futuristic-design-context';
import {
  FUTURISTIC_NAV_OPTIONS,
  FuturisticNavVariant,
  getFuturisticNavChrome,
} from '../context/futuristicNavChrome';

/** Preview picker for header/footer palette — remove after final choice. */
const FuturisticNavChromeSelector: React.FC = () => {
  const { navVariant, setNavVariant } = useFuturisticDesign();
  const { i18n } = useTranslation();
  const isHe = i18n.language === 'he' || i18n.resolvedLanguage === 'he';
  const chrome = getFuturisticNavChrome(navVariant);

  const handleChange = (e: SelectChangeEvent<string>) => {
    setNavVariant(e.target.value as FuturisticNavVariant);
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
          '& fieldset': { borderColor: 'rgba(34, 211, 238, 0.35)' },
          '&:hover fieldset': { borderColor: 'rgba(167, 139, 250, 0.5)' },
        },
        '& .MuiSvgIcon-root': { color: chrome.foreground },
      }}>
      <InputLabel id="futuristic-nav-label">גוון סרגלים</InputLabel>
      <Select
        labelId="futuristic-nav-label"
        value={navVariant}
        label="גוון סרגלים"
        onChange={handleChange}
        MenuProps={{ disableScrollLock: true }}>
        {FUTURISTIC_NAV_OPTIONS.map((opt) => (
          <MenuItem key={opt.id} value={opt.id} dense>
            {isHe ? opt.labelHe : opt.labelEn}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FuturisticNavChromeSelector;
