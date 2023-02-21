import React, { useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getSynopsisRaw, synopsisMap } from '../../inc/synopsisUtils';
import { Tooltip, useTheme } from '@mui/material';
import { iSynopsis, SourceType } from '../../types/types';

const useStyles = makeStyles({
  table: {
    marginBottom: '0.3rem',
    marginTop: '0.3rem',
    '& .MuiTableCell-root': {
      paddingTop: 0,
      paddingBottom: 0,
      borderBottom: '0px solid rgba(224, 224, 224, 1)',
    },
    '& td:first-child': {
      width: '3rem',
      padding: '0.2rem',
    },
  },
  cell: {
    padding: 0,
  },
});

interface Props {
  synopsis: iSynopsis[];
}

export default function SynopsisTable(props: Props) {
  const classes = useStyles();
  const theme = useTheme();

  const memoizedColor = useCallback((synopsis: iSynopsis)=>{
    if (synopsis.type === SourceType.TRANSLATION) {
      return theme.status.blue
    }
    const compositionType = synopsis.composition?.composition.type;
    switch (compositionType) {
      case 'parallel':
        return 'red'
      case 'excerpt':
        return 'purple'
      case 'yalkut':
        return null;
      case undefined:
        return null;
    }
  },[theme])

  const { synopsis } = props;

  if (!synopsis) {
    return null;
  }

  const sourceFullName = (synopsis) => {
    const location = synopsis?.location ? synopsis?.location : '';
    return `${synopsis?.name} ${location}`;
  };
  const sourceName = (synopsis) => {
    let name = synopsisMap.get(synopsis.id)?.title;
    if (!name) {
      name = synopsis.name;
    }

    return name;
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead></TableHead>
        <TableBody>
          {synopsis.map((synopsisRow, i) => {
            const rawText = getSynopsisRaw(synopsisRow);
            return rawText ? (
              <TableRow key={i}>
                <Tooltip enterDelay={800} leaveDelay={200} title={sourceFullName(synopsisRow)}>
                  <TableCell style={{ fontWeight: 'bold' }} component="td" scope="row">
                    {sourceName(synopsisRow)}
                  </TableCell>
                </Tooltip>
                <TableCell align="left" sx={{
                  color: memoizedColor(synopsisRow)
                }}>
                  {rawText}
                </TableCell>
              </TableRow>
            ) : null;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
