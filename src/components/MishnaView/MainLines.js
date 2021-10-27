import React from "react"
import {
  Typography,
} from "@mui/material"
import makeStyles from '@mui/styles/makeStyles';
import MainLine from "./MainLine"
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  lineNumber: {
    ...theme.typography.lineNumber,
  },
  sourceReference: {
    ...theme.typography.sourceReference,
  },
  smallTitle: {
    ...theme.typography.smallTitle,
    marginBottom: '1rem',
    marginTop: '1rem'
  }
}))

const MainLines = props => {
  const classes = useStyles()
  const { lines, sections } = props
  let sectionsIndex = 1;

  if (!lines) {
    return null
  }

  return (
    <div className={classes.root}>
      {lines.map((line, index) => {
        let newSectionTitle = null
        if (index===0 || sections?.find(s => s.startsAt === line.lineNumber)) {
          newSectionTitle = (
            <Typography
             align="center"
             className={classes.smallTitle}
            >
              [{sectionsIndex++}]
            </Typography>
          )
        }

        return (
          <div key={line.lineNumber}>
            {newSectionTitle}
            <MainLine 
            lineIndex={index}
            line={line} />
          </div>
        )
      })}
    </div>
  )
}

export default MainLines
