import React from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { ButtonBase } from '@mui/material';
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
      <AccordionSummary
        sx={{
          minHeight: '1px',
          //need space between '& .
          '& .muirtl-o4b71y-MuiAccordionSummary-content': { margin: '1px' },
          '&.muirtl-t4qmgb-MuiPaper-root-MuiAccordion-root.Mui-expanded': { margin: '1px' },
          //  '&.muirtl-tssa3v-MuiButtonBase-root-MuiAccordionSummary-root.Mui-expanded':
          //   {minHeight: '1px'},
          // '& .muirtl-tssa3v-MuiButtonBase-root-MuiAccordionSummary-root.Mui-expanded': { minHeight: '0px' },
          // '& .muirtl-o4b71y-MuiAccordionSummary-content.Mui-expanded': { margin: '1px' },
          '& .muirtl-o4b71y-MuiAccordionSummary-content.Mui-expanded': { margin: '1px 0' },
          '& .muirtl-tssa3v-MuiButtonBase-root-MuiAccordionSummary-root.Mui-expanded': { minHeight: '1px' },
          '& .muirtl-ed1dbh-MuiButtonBase-root-MuiAccordionSummary-root.Mui-expanded':
           {minHeight: '1px'},
           '& .muirtl-sh22l5-MuiButtonBase-root-MuiAccordionSummary-root':
           {color: 'blue'},
        }}>
        <Typography>
          {t(title)} - {filteredList.length}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ width: '100%' }}>
          {filteredList.map((excerpt) => (
            <ExcerptView key={excerpt.key} expanded={expanded} excerpt={excerpt} />
          ))}
        </div>
      </AccordionDetails>
    </ExcerptsAccordion>
  );
}
