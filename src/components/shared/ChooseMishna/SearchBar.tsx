import { IconButton, InputAdornment, Paper, TextField } from '@mui/material';
import { FC, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { objectToBase64 } from '../../../inc/objectToBase64';
import { useAppSelector } from '../../../app/hooks';

interface IProps {}

const SearchBar: FC<IProps> = () => {
  const { t } = useTranslation();
  const tractate = useAppSelector((state) => state.navigation?.currentMishna?.tractate);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const handleSearch = () => {
    if (searchValue) {
      navigate(`/search?query=${objectToBase64({ text: searchValue, tractate: tractate })}`);
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
