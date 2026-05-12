import React from 'react';
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface RabbiSearchBoxProps {
  value: string;
  onChange: (v: string) => void;
}

export const RabbiSearchBox = React.memo(({ value, onChange }: RabbiSearchBoxProps) => (
  <TextField
    fullWidth
    size="small"
    placeholder="חיפוש חכם..."
    value={value}
    onChange={e => onChange(e.target.value)}
    InputProps={{
      startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 0.5 }} fontSize="small" />,
    }}
    sx={{ mb: 1.5 }}
  />
));
