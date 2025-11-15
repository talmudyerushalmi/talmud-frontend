import React, { FC, ReactNode, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Accordion from '@mui/material/Accordion';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    '&.MuiPaper-root.MuiAccordion-root': { 
      backgroundColor: 'rgba(0, 0, 0, .03)',
      margin: 0,
      marginBottom: '-8px',
    },
    '&.MuiAccordion-root:before': { display: 'none' },
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    minHeight: 'auto',
    '& .MuiAccordionSummary-root': {
      minHeight: 'auto',
      padding: '8px 16px 0px 16px',
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiAccordionSummary-content': {
      margin: '0',
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiAccordionDetails-root': {
      padding: '2px 16px 8px 16px',
    },
  },
  rootExpanded: {
    overflow: 'hidden',
    '&.MuiPaper-root.MuiAccordion-root': { 
      backgroundColor: 'rgba(0, 0, 0, .03)',
      margin: 0,
      marginBottom: '-8px',
    },
    '&.MuiAccordion-root:before': { display: 'none' },
    flexGrow: 1,
    '& >  .MuiCollapse-root': {
      height: '100% !important',
      overflow: 'scroll',
    },
    '& > .MuiCollapse-root > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > div > .MuiAccordionDetails-root': {
      marginBottom: '5rem',
      padding: '2px 16px 8px 16px',
    },
    '& .MuiAccordionSummary-root': {
      minHeight: 'auto',
      padding: '8px 16px 0px 16px',
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiAccordionSummary-content': {
      margin: '0',
      display: 'flex',
      alignItems: 'center',
    },
  },
}));

interface IProps {
  children: NonNullable<ReactNode>;
}

export const ExcerptsAccordion: FC<IProps> = (props) => {
  const classes = useStyles();
  const { children } = props;
  const [excerptBox, setExcerptBox] = useState(false);
  const rootClass = excerptBox ? classes.rootExpanded : classes.root;

  return (
    <Accordion
      className={rootClass}
      square
      expanded={excerptBox}
      onChange={() => {
        setExcerptBox(!excerptBox);
      }}>
      {children}
    </Accordion>
  );
};

export default ExcerptsAccordion;
