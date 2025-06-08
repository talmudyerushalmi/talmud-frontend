import React, { FC, FormEvent, useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { iTractate } from '../../types/types';
import { useTranslation } from 'react-i18next';

interface SearchFormProps {
  initialQuery: string;
  onSearch: (query: string, selectedTractate: string | null) => void;
  isLoading: boolean;
  allTractates: iTractate[];
  selectedTractate: string | null;
}

const SearchForm: FC<SearchFormProps> = ({ initialQuery, onSearch, isLoading, allTractates, selectedTractate }) => {
  const [searchInput, setSearchInput] = useState('');
  const [tractateFilter, setTractateFilter] = useState<string | null>(selectedTractate);
  const { t } = useTranslation();

  useEffect(() => {
    if (initialQuery) {
      setSearchInput(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    setTractateFilter(selectedTractate);
  }, [selectedTractate]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onSearch(searchInput.trim(), tractateFilter);
  };

  const handleClearSearch = () => {
    setSearchInput('');
  };

  const handleTractateChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setTractateFilter(value === 'all' ? null : value);
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSearchSubmit}
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 1,
      }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
          {t('Free search in the tractate')}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('Enter search terms...')}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                backgroundColor: 'white',
              },
            }}
            InputProps={{
              endAdornment: searchInput && (
                <InputAdornment position="end">
                  <IconButton aria-label="clear search" onClick={handleClearSearch} edge="end" size="small">
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: '100%', sm: '200px' },
            }}>
            <InputLabel id="tractate-select-label">{t('Tractate')}</InputLabel>
            <Select
              labelId="tractate-select-label"
              value={tractateFilter || ''}
              label={t('Tractate')}
              onChange={handleTractateChange}
              sx={{
                backgroundColor: 'white',
              }}>
              {allTractates.map((tractate) => (
                <MenuItem key={tractate.id} value={tractate.id}>
                  {tractate.title_heb}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', width: { xs: '100%', sm: 'auto' } }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              disabled={!searchInput.trim() || isLoading}
              startIcon={<SearchIcon />}
              sx={{
                minWidth: '100px',
                width: '100%',
                borderRadius: 1,
                boxShadow: 1,
              }}>
              {t('Search')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default SearchForm;
