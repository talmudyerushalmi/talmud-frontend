import { Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyles = makeStyles((theme) => {
  console.log("theme ", theme);
  return {
    root: {
      position: "fixed",
      bottom: 0,
      //@ts-ignore
      background: theme.palette.mainMenu,
      color: "white",
      width: "100%",
      right: 0,
      padding: "1rem",
    },
  };
});

export const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.root}>
      <Container>
      <Grid container>
        <Grid item sm={5}>
        גרסה ראשונית, בפיתוח. הצעות כלליות בלבד תתקבלנה בברכה.
        </Grid>
        <Grid item sm={2}>
        רישיון CC BY-SA 3.0
        </Grid>
        <Grid item sm={5}>
        ייחוס לפרויקט תלמוד ירושלמי - מהדורה דיגיטלית, מנחם כ”ץ
        </Grid>
        </Grid>
        </Container>
      <ul>
      </ul>
      
    </footer>
  );
};
