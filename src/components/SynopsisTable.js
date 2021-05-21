import React from "react";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"

import { makeStyles } from "@material-ui/core/styles"
import SynopsisBuild  from "../cls/SynopsisBuild"

const useStyles = makeStyles((theme) => {
  return {

    table: {
      width: "100%",
      direction: "rtl",
      '& th,td': {
        textAlign: 'right',
        direction: 'rtl'
      },
      '& thead tr:nth-of-type(odd)': {
        backgroundColor: '#f5f5f5',
      },
      '& tbody tr:nth-of-type(odd)': {
        //backgroundColor: '#f5f5f5',
      },
    },
    manuscript: {
      minWidth: '8rem',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular
    },
    expansion: {
      display: "block"
    },
    lineNumber: {
      ...theme.typography.lineNumber
    },
    sourceReference: {
      ...theme.typography.sourceReference
    }
  }
})
export const SynopsisTable = (props)=>{
  const classes = useStyles();




  const { line, synopsis} = props;
  const synopsisBuild = new SynopsisBuild(line.text, synopsis);
  synopsisBuild.getSynopsis();
  console.log('table ', synopsisBuild.synopsisTable);

  const words = synopsisBuild.baseArray.map(word => {
    if (word.placeholder) {
      return " ";
    } else {
      return word.word;
    }
  });


  return (

    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.manuscript}>שורה</TableCell>
              {
                words.map(word => (<TableCell>{word}</TableCell>))
              }

            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(synopsisBuild.synopsisTable).map((key,index) => (
              <TableRow key={index}>
                <TableCell style={{fontWeight:'bold'}}
                  component="th" scope="row">
                  {key}
                </TableCell>
                {
                  synopsisBuild.synopsisTable[key].map(word => (
                    <TableCell component="th" scope="row">
                      {word}
                    </TableCell>
                  ))
                }


              </TableRow>
            ))}

          </TableBody>
        </Table>
      </TableContainer>

    </>
  );
}
