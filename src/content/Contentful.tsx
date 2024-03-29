import React, { useEffect, useState } from 'react';
import ContentService from '../services/content.service';
import { Content } from '../content/types';
import ContentField from '../content/ContentField';
import { Box, Typography } from '@mui/material';
import i18next from 'i18next';
import { localeMap } from '../inc/utils';
import { connect } from 'react-redux';

interface Props {
  id: string;
  items: any;
}

const mapStateToProps = (state: any) => ({
  items: state.contentful.items,
});

const Contentful = (props: Props) => {
  const { id, items } = props;
  const [content, setContent] = useState<Content | null>(null);
  const [currentLang, setCurrentLang] = useState<string>(i18next.language);

  useEffect(() => {
    i18next.on('languageChanged', function (lng) {
      setCurrentLang(lng);
    });
  }, []);

  useEffect(() => {
    if (items && id && currentLang) {
      const lang = localeMap.get(currentLang) || ""
      if (items.hasOwnProperty(lang) && items[lang].hasOwnProperty(id)) {
        const content = items[lang][id]
        setContent(content)
      }
    }
  }, [id, currentLang, items]);

  const direction = currentLang == 'he' ? 'rtl' : 'ltr';

  return (
    <Box style={{ direction: direction }}>
      {content?.fields['title'] ? (
        <Typography style={{ textAlign: 'center' }} variant="h2">
          {content?.fields['title']}
        </Typography>
      ) : null}
      {content?.fields
        ? Object.entries(content.fields).map(([k, v]) => {
            return <ContentField key={k} fieldName={k} fieldValue={v} />;
          })
        : null}
    </Box>
  );
};

export default connect(mapStateToProps)(Contentful);
