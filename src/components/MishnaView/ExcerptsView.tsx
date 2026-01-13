import React from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExcerptView from './ExcerptView';
import { excerptsMap } from '../../inc/excerptUtils';
import { useTranslation } from 'react-i18next';
import { ExcerptsAccordion } from './exercptsAccordion';

export default function ExcerptsView(props) {
  const { excerpts, expanded, type } = props;
  const { t } = useTranslation();

  const title = excerptsMap.get(type)?.title || '';
  const filteredList = excerpts?.filter((excerpt) => excerpt.type === type);

  if (!excerpts || filteredList.length === 0) {
    return null;
  }

  return (
    <ExcerptsAccordion>
      <AccordionSummary sx={{
        '& .MuiTypography-root': {
          'html:lang(he) &': {
            marginLeft: 0,
            marginRight: 'auto',
          },
          'html:lang(en-US) &': {
            marginLeft: 'auto',
            marginRight: 0,
          },
        },
      }}>
        <Typography>
          {t(title)} - {filteredList.length || 0}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        {filteredList.map((excerpt) => (
          <ExcerptView key={excerpt.key} expanded={expanded} excerpt={excerpt} />
        ))}
      </AccordionDetails>
    </ExcerptsAccordion>
  );
}
