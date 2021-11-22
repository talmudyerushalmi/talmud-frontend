import { makeStyles, Paper, Typography } from "@material-ui/core"
import React from "react"
import { hebrewMap } from "../../inc/utils";

const useStyles = makeStyles((theme) => ({
    root: {
      //@ts-ignore
     ...theme.panels.standard,
     marginBottom: '1rem'
    },
    smallTitle: {
      //@ts-ignore
        ...theme.typography.smallTitle
    }

  }));

const MishnaText = props => {
  const { html, mishna } = props
  const mishnaTitle = mishna ? 
  `[משנה ${hebrewMap.get(parseInt(mishna))}]`: null

  const classes = useStyles();
  return (
    <Paper 
    elevation={0}
    className={classes.root}>
        <Typography
        className={classes.smallTitle}
        paragraph={true}
        align='center'
        variant="h6"
        >{mishnaTitle}</Typography>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </Paper>
  )
}

export default MishnaText
