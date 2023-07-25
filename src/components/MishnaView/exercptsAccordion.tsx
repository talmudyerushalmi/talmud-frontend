import React, { FC, ReactNode, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Accordion from '@mui/material/Accordion';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    '&.MuiPaper-root.MuiAccordion-root': { backgroundColor: 'rgba(0, 0, 0, .03)' },
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    minHeight: '2rem',
  },
  rootExpanded: {
    //drop down label stays up top, does not expand
    '& .muirtl-1ibip0b-MuiButtonBase-root-MuiAccordionSummary-root.Mui-expanded': {minHeight: '1px'},
    '& .muirtl-19ny162-MuiButtonBase-root-MuiAccordionSummary-root.Mui-expanded': {minHeight: '1px'},
    //decrease spaces in drop down between entries
    '& .muirtl-sh22l5-MuiButtonBase-root-MuiAccordionSummary-root': {minHeight: '1px'},
    '& .muirtl-o4b71y-MuiAccordionSummary-content': {margin: '1px'},
    overflow: 'hidden',
    '&.MuiPaper-root.MuiAccordion-root': { backgroundColor: 'rgba(0, 0, 0, .03)' },
    '&.MuiPaper-root.MuiPaper-elevation.MuiPaper-elevation1.MuiAccordion-root.Mui-expanded.MuiAccordion-gutters.makeStyles-rootExpanded-12.muirtl-t4qmgb-MuiPaper-root-MuiAccordion-root': {margin: '1px'},
    flexGrow: 1,
    '& >  .MuiCollapse-root': {
      height: '100% !important',
      overflow: 'scroll',
    },
    '& > .MuiCollapse-root > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > div > .MuiAccordionDetails-root': {
      marginBottom: '3rem',
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
