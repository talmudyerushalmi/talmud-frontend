import React, { FC } from 'react';
import { Box, Card, Typography, Divider, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ISearchResult } from '../../store/reducers/searchReducer';
import { hebrewMap } from '../../inc/utils';
import NosachView from '../MishnaView/NosachView';
import { ShowEditType } from '../../store/reducers/mishnaViewReducer';
import { iTractate } from '../../types/types';

interface SearchResultsProps {
  isLoading: boolean;
  searchResults: ISearchResult[];
  queryText: string;
  allTractates: iTractate[];
}

const SearchResults: FC<SearchResultsProps> = ({ isLoading, searchResults, queryText, allTractates }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 2,
          width: '100%',
          textAlign: 'center',
          borderRadius: 1,
        }}>
        <Typography variant="subtitle2">{t('Searching...')}</Typography>
      </Paper>
    );
  }

  return (
    <Box display="flex" gap={1.5} flexDirection="column" alignItems="center" mb={4}>
      {searchResults.length === 0 && !queryText && (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            width: '100%',
            textAlign: 'center',
            borderRadius: 1,
          }}>
          <Typography variant="subtitle2">{t('Enter search terms to begin')}</Typography>
        </Paper>
      )}

      {searchResults.length === 0 && (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            width: '100%',
            textAlign: 'center',
            borderRadius: 1,
          }}>
          <Typography variant="subtitle2">
            {t('No results found for')} {queryText}
          </Typography>
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
            {t('Try searching for different words')}
          </Typography>
        </Paper>
      )}

      {searchResults.map((result, index) => {
        const [tractate, chapter, mishna] = result.guid.split('_');
        const tractateInfo = allTractates.find((item) => item.id === tractate);
        const tractateTitle = tractateInfo?.title_heb || tractate;

        return (
          <Card
            key={index}
            sx={{
              width: '100%',
              p: 2,
              cursor: 'pointer',
              borderRadius: 1,
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              background: 'white',
              '&:hover': {
                transform: 'scale(1.005)',
                boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.12)',
              },
              position: 'relative',
              overflow: 'visible',
            }}
            onClick={() => {
              navigate(`/talmud/${tractate}/${chapter}/${mishna}`);
            }}>
            <Box
              sx={{
                position: 'absolute',
                top: 5,
                right: -10,
                bgcolor: 'primary.main',
                color: 'white',
                width: 24,
                height: 24,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
              }}>
              {index + 1}
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {tractateTitle}, {hebrewMap.get(chapter)}, {hebrewMap.get(mishna)}
              </Typography>
              <Divider sx={{ my: 1 }} />
            </Box>

            {result.nosach && (
              <Box
                sx={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  direction: 'rtl',
                  p: 0.75,
                  borderRadius: 1,
                  bgcolor: 'rgba(0, 0, 0, 0.02)',
                }}>
                <NosachView
                  subline={{
                    nosach: result.nosach,
                    text: result.nosach.blocks[0].text,
                    index: result.sublineIndex,
                    synopsis: [],
                  }}
                  showEditType={ShowEditType.COMBINED}
                  showPunctuation={true}
                />
              </Box>
            )}
          </Card>
        );
      })}
    </Box>
  );
};

export default SearchResults;
