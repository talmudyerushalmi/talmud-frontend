import React, { useEffect, useState } from 'react';
import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PageService from '../../services/pageService';
import { iTractate } from '../../types/types';
function formatTractateNameEn(id: string): string {
  return id
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/** Homepage tractate picker — navigates to chapter 001 / halacha 001. */
const HomeTractateSelect: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isHebrew = i18n.language.startsWith('he');
  const [tractates, setTractates] = useState<iTractate[]>([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    PageService.getAllTractates().then(setTractates).catch(() => setTractates([]));
  }, []);

  const tractateLabel = (t: iTractate) =>
    isHebrew ? t.title_heb : formatTractateNameEn(t.id);

  const placeholder = isHebrew ? 'בחר מסכת' : 'Select tractate';
  const fieldWidth = isHebrew ? '7.25rem' : '8.75rem';

  const onChange = (event: SelectChangeEvent<string>) => {
    const id = event.target.value;
    if (!id) {
      return;
    }
    navigate(`/talmud/${id}/001/001`);
    setValue('');
  };

  const menuPaperSx = {
    direction: isHebrew ? 'ltr' : 'rtl',
    minWidth: fieldWidth,
    width: 'max-content',
    maxWidth: 'min(90vw, 16rem)',
  };

  return (
    <Box
      dir={isHebrew ? 'ltr' : 'rtl'}
      sx={{
        direction: isHebrew ? 'ltr' : 'rtl',
        display: 'flex',
        justifyContent: 'center',
        mt: 1,
      }}>
      <FormControl size="small" sx={{ width: fieldWidth }}>
        <Select
          value={value}
          displayEmpty
          onChange={onChange}
          MenuProps={{
            slotProps: {
              paper: { sx: menuPaperSx, dir: isHebrew ? 'ltr' : 'rtl' },
            },
          }}
          renderValue={(selected) => {
            const label = !selected
              ? placeholder
              : (() => {
                  const t = tractates.find((x) => x.id === selected);
                  return t ? tractateLabel(t) : selected;
                })();
            return (
              <Box
                component="span"
                sx={{
                  opacity: selected ? 1 : 0.75,
                  display: 'block',
                  width: '100%',
                  textAlign: isHebrew ? 'left' : 'right',
                }}>
                {label}
              </Box>
            );
          }}
          sx={{
            width: '100%',
            color: '#e2e8f0',
            fontFamily: '"IBM Plex Sans", sans-serif',
            fontSize: '0.95rem',
            bgcolor: 'rgba(15, 23, 42, 0.85)',
            borderRadius: 2,
            '& .MuiSelect-select': {
              py: 1.25,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: isHebrew ? 'left' : 'right',
              ...(isHebrew
                ? {
                    paddingRight: '1.75rem !important',
                    paddingLeft: '0.5rem !important',
                  }
                : {
                    paddingLeft: '1.75rem !important',
                    paddingRight: '0.35rem !important',
                  }),
            },
            ...(isHebrew
              ? {
                  '& .MuiSelect-icon': {
                    right: 7,
                    left: 'auto',
                  },
                }
              : {
                  '& .MuiSelect-icon': {
                    left: 7,
                    right: 'auto',
                  },
                }),
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(34, 211, 238, 0.35)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(34, 211, 238, 0.55)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#22d3ee',
            },
            '& .MuiSvgIcon-root': {
              color: '#67e8f9',
            },
          }}>
          {tractates.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {tractateLabel(t)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default HomeTractateSelect;
