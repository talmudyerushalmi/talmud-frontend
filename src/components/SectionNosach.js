import { Paper, Typography } from "@material-ui/core"

import React from "react";
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: "100%",
      direction: "rtl"
    },
    lineNumber: {
      ...theme.typography.lineNumber,
      padding: '0px 1rem 0 0.5rem',

    },
  }
})


export const SectionNosach = (props)=>{

  const {nosach} = props;

  const classes = useStyles();

  return (
    <>
      <Paper className={classes.root}>
        <Typography variant="h5"
                    style={{margin: '1rem'}}>נוסח</Typography>
        {
          nosach.map(n => {
            return (
              <>
                <div style={{display:'flex'}}>


              <span className={classes.lineNumber}>
                {n.line}
              </span>
                  <div dangerouslySetInnerHTML={{ __html: n.nosach }}/>
                </div>
              </>
            )
          })
        }

      </Paper>
    </>
  );
}

