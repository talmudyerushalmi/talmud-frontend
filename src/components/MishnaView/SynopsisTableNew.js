import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import { synopsisMap } from "../../inc/synopsisUtils"
import { Tooltip } from "@material-ui/core"

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    marginBottom: '0.3rem',
    marginTop: '0.3rem',
    "& .MuiTableCell-root": {
      paddingTop: 0,
      paddingBottom: 0,
      borderBottom: "0px solid rgba(224, 224, 224, 1)",
    },
    "& td:first-child": {
        width: '3rem',
        padding: '0.2rem'
    }
  },
  cell: {
    padding: 0,
  },
})


export default function SynopsisTableNew(props) {
  const classes = useStyles()
  const { synopsis } = props

  if (!synopsis) {
    return null
  }

  const sourceFullName = synopsis => {
      const location = synopsis?.location ? synopsis?.location : ""
      return `${synopsis?.name} ${location}`
  }
  const sourceName = synopsis => {
    let name = synopsisMap.get(synopsis.id)?.title
    if (!name) {
      name = synopsis.name
    }

    return name
  }
  const getText = synopsis => {
    if (synopsis.text?.text) {
      return synopsis.text?.text
    }
    if (typeof synopsis?.text === "string") {
        return synopsis.text
    }
    return null;
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead></TableHead>
        <TableBody>
          {synopsis
             .filter(row => row.text.text?.trim().length>0)
            .map(row => (
              <TableRow key={row.name}>
                <Tooltip enterDelay={800} leaveDelay={200}
                title={sourceFullName(row)}>
                <TableCell 
                style={{fontWeight:'bold'}}
                component="td" scope="row">
                  {sourceName(row)}
                </TableCell>
                </Tooltip>  
                <TableCell align="left">{getText(row)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
