import { Paper, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { hebrewMap } from '../../inc/utils';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      '&.MuiPaper-root': {
        //@ts-ignore
        //  ...theme.panels.standard,
      },
      '&.MuiPaper-root div': {
        //@ts-ignore
        ...theme.custom.smallTitle,
      },
      //  marginBottom: '1rem',
      fontWeight: 'bold',
      fontSize: '0.8rem',
      color: '#795548',
      // marginRight: '2rem',
    },
  };
});

const MishnaText = (props) => {
  const { html, mishna } = props;
  const hebrewLetter = mishna ? hebrewMap.get(mishna) : '';
  
  // Prepend the Hebrew letter in square brackets to the beginning of the HTML content
  const contentWithLetter = hebrewLetter 
    ? `<span style="color: black; font-size: 0.9em; font-weight: normal; margin-left: 0.01rem;">[${hebrewLetter}]</span> ${html}`
    : html;

  const classes = useStyles();
  return (
    <Paper elevation={0} className={classes.root}>
      <div dangerouslySetInnerHTML={{ __html: contentWithLetter }}></div>
    </Paper>
  );
};

export default MishnaText;
