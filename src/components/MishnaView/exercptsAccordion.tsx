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
    minHeight: '3.5rem',
  },
  rootExpanded: {
    overflow: 'hidden',
    '&.MuiPaper-root.MuiAccordion-root': { backgroundColor: 'rgba(0, 0, 0, .03)' },
    flexGrow: 1,
    '& >  .MuiCollapse-root': {
      height: '100% !important',
      overflow: 'scroll',
    },
    '& > .MuiCollapse-root > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > div > .MuiAccordionDetails-root': {
      marginBottom: '5rem',
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
