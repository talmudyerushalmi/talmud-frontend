import { IconButton, InputAdornment, Paper, TextField } from '@mui/material';
import { FC, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  tractate?: string;
  onSearch?: (searchValue: string, tractate?: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ tractate, onSearch }) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearch = () => {
    if (searchValue && onSearch) {
      onSearch(searchValue, tractate);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: { md: 400, xs: '100%' },
        boxShadow: 'none',
        mb: 4,
      }}>
      <TextField
        sx={{
          ml: { md: '30px' },
          flex: 1,
          '& .MuiInputBase-root': {
            p: 0,
          },
        }}
        label={t('Free search in the tractate')}
        size="small"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <IconButton type="submit" aria-label="search">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Paper>
  );
};

export default SearchBar;
