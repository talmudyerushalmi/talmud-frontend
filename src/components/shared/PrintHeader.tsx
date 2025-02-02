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

  const tractateTitle = allTractates.find((item) => item.id === tractate)?.title_heb;
  const chapterTitle = hebrewMap.get(chapter || '');
  const halakhaTitle = mishna ? hebrewMap.get(mishna || '') : undefined;
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
          '@media print': {
            '@page': {
              '@top-left': {
                content: `"ירושלמי ${t('Tractate')} ${tractateTitle} ${t('Chapter')} ${chapterTitle}${
                  halakhaTitle ? ` ${t('Halakha')} ${halakhaTitle}` : ''
                }"`,
                fontSize: '13px',
              },
            },
          },
        }}>
        {t('Tractate')} {tractateTitle}
        <span className="separator">•</span>
        {t('Chapter')} {chapterTitle}
        {mishna && (
          <>
            <span className="separator">•</span>
            {t('Halakha')} {halakhaTitle}
          </>
        )}
      </Typography>
    </div>
  );
};
