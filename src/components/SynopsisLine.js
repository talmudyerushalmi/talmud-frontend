import React from "react";
import { makeStyles } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    direction: 'rtl'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  manuscript: {
    ...theme.typography.manuscript
  }
}));


export const SynopsisLine = (props)=>{

  const { line } = props;


  const classes = useStyles();

  return (

   <div>
     <Typography className={classes.manuscript}>
       {line.manuscript}
     </Typography>
     <Typography>
       {line.text}
     </Typography>

   </div>
  );
}

