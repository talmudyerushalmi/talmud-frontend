import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { searchText } from '../store/actions/searchActions';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Card, Typography } from '@mui/material';
import { ISearchResult } from '../store/reducers/searchReducer';
import { base64ToJson } from '../inc/base64ToJson';
import { hebrewMap } from '../inc/utils';
import PageService from '../services/pageService';
import { ShowEditType } from '../store/reducers/mishnaViewReducer';
import NosachView from '../components/MishnaView/NosachView';

interface IProps {}

const SearchPage: FC<IProps> = () => {
  const dispatch = useAppDispatch();
  const searchResults = useAppSelector((state: any) => state?.search?.searchResults) as ISearchResult[];
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [allTractates, setAllTractates] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      dispatch(searchText(query));
    }
  }, [dispatch, query]);

  const queryObject = base64ToJson(query);
  const queryText = queryObject.text.trim();

  useEffect(() => {
    PageService.getAllTractates().then((tractates) => {
      setAllTractates(tractates);
    });
  }, []);

  return (
    <Box display="flex" gap={{ md: 1, xs: 1 }} flexDirection="column" alignItems="center" mb={8}>
      {searchResults.map((result, index) => {
        const [tractate, chapter, mishna] = result.guid.split('_');

        return (
          <Card
            key={index}
            sx={{
              width: '80%',
              p: 3,
              cursor: 'pointer',
              borderRadius: 3,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              background: 'white',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0px 6px 25px rgba(0, 0, 0, 0.15)',
              },
              position: 'relative',
              overflow: 'unset',
            }}
            onClick={() => {
              navigate(`/talmud/${tractate}/${chapter}/${mishna}`);
            }}>
            <Typography
              sx={{
                position: 'absolute',
                top: 5,
                right: 10,
                fontWeight: 'bold',
                fontSize: 16,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -1,
                  left: 0,
                  width: '100%',
                  height: 3,
                  backgroundColor: ({ palette }) => palette.primary.main,
                },
              }}>
              {index + 1}
            </Typography>
            <Typography sx={{ fontSize: 18, mb: 2 }}>
              {allTractates.find((item) => item.id === tractate)?.title_heb}, {hebrewMap.get(chapter)},{' '}
              {hebrewMap.get(mishna)}
            </Typography>
            {result.nosach && (
              <Box sx={{ fontSize: 17, lineHeight: 1.8, direction: 'rtl' }}>
                <NosachView
                  subline={{
                    nosach: result.nosach,
                    text: result.nosach.blocks[0].text,
                    index: result.sublineIndex,
                    synopsis: [],
                  }}
                  showEditType={ShowEditType.COMBINED}
                  showPunctuation={true}
                  searchTerm={queryText}
                />
              </Box>
            )}
          </Card>
        );
      })}
    </Box>
  );
};

export default SearchPage;
