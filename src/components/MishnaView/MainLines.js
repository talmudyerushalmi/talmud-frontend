import React from "react"
import {
  Typography,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { MainLine } from "./MainLine"
import { MainLineNew } from "./MainLineNew"
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
            <MainLineNew 
            lineIndex={index}
            line={line} />
          </div>
        )
      })}
    </div>
  )
}

export default MainLines
