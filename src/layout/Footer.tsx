import React from 'react';
import { Container, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import cc from '../assets/cc.png';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      position: 'fixed',
      bottom: 0,
      background: theme.palette.primary.main,
      color: 'white',
      width: '100%',
      right: 0,
      paddingTop: '0 0.3rem',
      textAlign: 'center',
    },
  };
});

export const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.root}>
      <Container>
        <Grid container>
          <Grid item sm={4}>
            מהדורה דיגיטלית Digital Critical Edition
          </Grid>
          <Grid item sm={4}>
            אתר בהקמה, אין לצטט בשלב זה
          </Grid>
          <Grid item sm={4}>
            תשפ”ג 2023-2021
            <img
              src={cc}
              style={{
                top: '0.15rem',
                paddingRight: '0.3rem',
                height: '1.5rem',
                position: 'absolute',
              }}
            ></img>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};
