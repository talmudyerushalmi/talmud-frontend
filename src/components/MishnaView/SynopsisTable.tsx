import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getSynopsisRaw, synopsisMap } from '../../inc/synopsisUtils';
import { Tooltip } from '@mui/material';
import { iManuscriptPopup, iSubline } from '../../types/types';
import { setRelevantManuscript } from '../../store/actions/relatedActions';
import { connect } from 'react-redux';
import ButtonUnstyled from '../shared/ButtonUnstyled';

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
  parellel: {
    '&.MuiTableCell-root': { color: 'red' },
  },
  excerpt: {
    '&.MuiTableCell-root': { color: 'purple' },
  },
  default: {},
});

const mapDispatchToProps = (dispatch) => ({
  setRelevantManuscript: (data: iManuscriptPopup) => {
    dispatch(setRelevantManuscript(data));
  },
});

interface Props {
  subline: iSubline;
  setRelevantManuscript: (data: iManuscriptPopup) => void;
}

const SynopsisTable = (props: Props) => {
  const classes = useStyles();
  const { subline, setRelevantManuscript } = props;
  const { synopsis, index } = subline;

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
          {synopsis.map((synopsisRow, i: number) => {
            const rawText = getSynopsisRaw(synopsisRow);
            const compositionType = synopsisRow.composition?.composition.type;
            let className = classes.default;
            switch (compositionType) {
              case 'parallel':
                className = classes.parellel;
                break;
              case 'excerpt':
                className = classes.excerpt;
                break;
              case 'yalkut':
                className = classes.excerpt;
                break;
              case undefined:
                className = classes.default;
            }
            return rawText ? (
              <TableRow key={i}>
                <Tooltip enterDelay={800} leaveDelay={200} title={sourceFullName(synopsisRow)}>
                  <TableCell style={{ fontWeight: 'bold' }} component="td" scope="row">
                    <ButtonUnstyled
                      onClick={() => {
                        setRelevantManuscript({
                          line: index,
                          subline: subline,
                          manuscript: synopsisRow.id,
                        });
                      }}>
                      {sourceName(synopsisRow)}
                    </ButtonUnstyled>
                  </TableCell>
                </Tooltip>
                <TableCell className={className} align="left">
                  {rawText}
                </TableCell>
              </TableRow>
            ) : null;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default connect(null, mapDispatchToProps)(SynopsisTable);
