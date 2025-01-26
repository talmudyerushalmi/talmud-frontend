import React from 'react';
import { useParams } from 'react-router';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { routeObject } from '../../store/reducers/navigationReducer';
import { hebrewMap } from '../../inc/utils';

interface PrintHeaderProps {
  allTractates: any[];
}

export const PrintHeader: React.FC<PrintHeaderProps> = ({ allTractates }) => {
  const { tractate, chapter, mishna } = useParams<routeObject>();
  const { t } = useTranslation();

  return (
    <div className="print-choose-mishna-bar">
      <Typography
        variant="h6"
        align="center"
        sx={{
          padding: '12px',
          '& .separator': {
            margin: '0 8px',
            opacity: 0.7,
          },
        }}>
        {t('Tractate')} {allTractates.find((item) => item.id === tractate)?.title_heb}
        <span className="separator">•</span>
        {t('Chapter')} {hebrewMap.get(chapter || '')}
        {hebrewMap.get(mishna || '') && (
          <>
            <span className="separator">•</span>
            {t('Mishna')} {hebrewMap.get(mishna || '')}
          </>
        )}
      </Typography>
    </div>
  );
}; 