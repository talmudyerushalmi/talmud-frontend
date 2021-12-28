import React from "react";
import { Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import cc from '../assets/cc.png';

const useStyles = makeStyles((theme) => {
  console.log("theme ", theme);
  return {
    root: {
      position: "fixed",
      height: '1.7rem',
      bottom: 0,
      //@ts-ignore
      background: theme.palette.mainMenu,
      color: "white",
      width: "100%",
      right: 0,
      paddingTop:'0.3rem'
     // padding: "1rem",
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
        מהדורה דיגיטלית
Digital Critical Edition
        </Grid>
        <Grid item sm={4}>
        אתר בהקמה, אין לצטט בשלב זה
        </Grid>
        <Grid item sm={4}>
        תשפ”ב 2021-2022
        <img src={cc} style={{
              top: '0.15rem',
              paddingRight: '0.3rem',
          height:'1.5rem', position:'absolute'}}></img>
        </Grid>
        </Grid>
        </Container>     
    </footer>
  );
};
