import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { searchText } from '../store/actions/searchActions';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { ISearchResult } from '../store/reducers/searchReducer';
import { base64ToJson } from '../inc/base64ToJson';
import PageService from '../services/pageService';
import SearchForm from '../components/SearchPage/SearchForm';
import SearchResults from '../components/SearchPage/SearchResults';
import { iTractate } from '../types/types';
import { objectToBase64 } from '../inc/objectToBase64';

interface IProps {}

const SearchPage: FC<IProps> = () => {
  const dispatch = useAppDispatch();
  const searchResults = useAppSelector((state: any) => state?.search?.searchResults) as ISearchResult[];
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [allTractates, setAllTractates] = useState<iTractate[]>([]);
  const navigate = useNavigate();
  const isLoading = useAppSelector((state: any) => state?.general?.loading);

  useEffect(() => {
    if (query) {
      dispatch(searchText(query));
    }
  }, [dispatch, query]);

  const queryObject = base64ToJson(query);
  const queryText = queryObject?.text?.trim();
  const selectedTractate = queryObject?.tractate;

  useEffect(() => {
    PageService.getAllTractates().then((tractates) => {
      setAllTractates(tractates);
    });
  }, []);

  const handleSearch = (searchQuery: string, selectedTractate: string | null) => {
    navigate(`/search?query=${objectToBase64({ text: searchQuery, tractate: selectedTractate })}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <SearchForm
        initialQuery={queryText}
        onSearch={handleSearch}
        isLoading={isLoading}
        allTractates={allTractates}
        selectedTractate={selectedTractate}
      />

      <SearchResults
        isLoading={isLoading}
        searchResults={searchResults}
        queryText={queryText || ''}
        allTractates={allTractates}
      />
    </Container>
  );
};

export default SearchPage;
