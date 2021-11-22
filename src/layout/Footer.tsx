import { Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyles = makeStyles((theme) => {
  console.log("theme ", theme);
  return {
    root: {
      position: "fixed",
      height: '1.5rem',
      bottom: 0,
      //@ts-ignore
      background: theme.palette.mainMenu,
      color: "white",
      width: "100%",
      right: 0,
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
        </Grid>
        <Grid item sm={4}>
        אתר בהקמה, אין לצטט בשלב זה
        </Grid>
        <Grid item sm={4}>
        </Grid>
        </Grid>
        </Container>
      <ul>
      </ul>
      
    </footer>
  );
};
