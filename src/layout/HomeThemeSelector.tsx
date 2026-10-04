import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {
  HOME_THEME_OPTIONS,
  HomeThemeId,
  useHomeTheme,
} from '../context/home-theme-context';
import { useTranslation } from 'react-i18next';

/**
 * Lets visitors preview three homepage design concepts (stored in localStorage).
 * Visible to everyone per product decision — remove after a winner is chosen.
 */
const HomeThemeSelector: React.FC = () => {
  const { themeId, setThemeId } = useHomeTheme();
  const { i18n } = useTranslation();
  const isHe = i18n.language === 'he' || i18n.resolvedLanguage === 'he';

  const handleChange = (e: SelectChangeEvent<string>) => {
    setThemeId(e.target.value as HomeThemeId);
  };

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: { xs: 140, md: 200 },
        mx: 1,
        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.85)' },
        '& .MuiOutlinedInput-root': {
          color: 'white',
          '& fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.7)' },
        },
        '& .MuiSvgIcon-root': { color: 'white' },
      }}>
      <InputLabel id="home-theme-label">עיצוב בית — תצוגה מקדימה</InputLabel>
      <Select
        labelId="home-theme-label"
        value={themeId}
        label="עיצוב בית — תצוגה מקדימה"
        onChange={handleChange}
        MenuProps={{ disableScrollLock: true }}>
        {HOME_THEME_OPTIONS.map((opt) => (
          <MenuItem key={opt.id} value={opt.id}>
            {isHe ? opt.labelHe : opt.labelEn}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default HomeThemeSelector;
