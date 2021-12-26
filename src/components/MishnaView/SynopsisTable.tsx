import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import { getSynopsisRaw, synopsisMap } from "../../inc/synopsisUtils"
import { Tooltip } from "@material-ui/core"
import { iSynopsis } from "../../types/types"

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
  parellel: {
    color: 'red'
  },
  excerpt: {
    color: 'purple'
  },
  default:{
  }
})

interface Props {
  synopsis: iSynopsis[];
}

export default function SynopsisTable(props: Props) {
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


  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead></TableHead>
        <TableBody>
          {synopsis
            .map((synopsisRow,i) => {
              const rawText = getSynopsisRaw(synopsisRow);
              const compositionType = synopsisRow.composition?.composition.type;
              let className = classes.default;
              switch(compositionType) {
                case 'parallel': className = classes.parellel;
                break;
                case 'excerpt': className = classes.excerpt;
                break;
                case 'yalkut': className = classes.excerpt;
                break;
                case undefined: className = classes.default;
              }
              return (
                rawText ?
              <TableRow key={i}>
                <Tooltip enterDelay={800} leaveDelay={200}
                title={sourceFullName(synopsisRow)}>
                <TableCell 
                style={{fontWeight:'bold'}}
                component="td" scope="row">
                  {sourceName(synopsisRow)}
                </TableCell>
                </Tooltip>  
                <TableCell className={className} align="left">{rawText}</TableCell>
              </TableRow> : null
            )}
            )}
      
        </TableBody>
      </Table>
    </TableContainer>
  )
}
