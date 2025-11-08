import React, { useCallback, useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getSynopsisRaw, buildSynopsisMap } from '../../inc/synopsisUtils';
import { iManuscript, iManuscriptPopup, iSubline } from '../../types/types';
import { setSublineData } from '../../store/actions/relatedActions';
import { connect } from 'react-redux';
import ButtonUnstyled from '../shared/ButtonUnstyled';
import { getImageUrl } from '../../inc/manuscriptUtils';
import { Tooltip, useTheme } from '@mui/material';
import { iSynopsis, SourceType } from '../../types/types';
import { useAppSelector } from '../../app/hooks';

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

const mapStateToProps = (state) => ({
  manuscriptsForChapter: state.related.manuscriptsForChapter,
});

const mapDispatchToProps = (dispatch) => ({
  setSublineData: (data: iManuscriptPopup) => {
    dispatch(setSublineData(data));
  },
});

interface Props {
  subline: iSubline;
  setSublineData: (data: iManuscriptPopup) => void;
  lineNumber: string;
  manuscriptsForChapter: iManuscript[];
}

const SynopsisTable = (props: Props) => {
  const classes = useStyles();
  const { subline, setSublineData, lineNumber, manuscriptsForChapter } = props;
  const { synopsis } = subline;
  const theme = useTheme();
  
  // Get synopsis list from Redux and build the map
  const synopsisList = useAppSelector((state) => state.synopsis.synopsisList);
  const synopsisMap = useMemo(() => buildSynopsisMap(synopsisList), [synopsisList]);

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


  if (!synopsis) {
    return null;
  }

  const sourceFullName = (synopsis) => {
    const location = synopsis?.location ? synopsis?.location : '';
    return `${synopsis?.name} ${location}`;
  };
  
  /**
   * Shortens parallel source description by extracting the source short name from synopsisMap
   * Example: "סוטה ב ה [00175] - כתב יד ליידן" -> "סוטה ב ה - ל"
   */
  const shortenParallelSourceName = (name: string, synopsisButtonCode: string): string => {
    // Pattern: "tractate chapter mishna [lineNumber] - sourceName"
    const match = name.match(/^(.+?)\s+\[[\d]+\]\s+-\s+(.+)$/);
    
    if (!match) {
      return name; // Return original if pattern doesn't match
    }
    
    const tractateChapterMishna = match[1]; // "סוטה ב ה"
    const sourceName = match[2]; // "כתב יד ליידן"
    
    // Try to get the short name from synopsisMap based on button_code
    const shortName = synopsisMap.get(synopsisButtonCode)?.title;
    
    // If we found a short name in the map, use it; otherwise use the full source name
    const abbreviatedSource = shortName || sourceName;
    
    return `${tractateChapterMishna} - ${abbreviatedSource}`;
  };
  
  const sourceName = (synopsis) => {
    const shortTitle = synopsisMap.get(synopsis.id)?.title;
    if (shortTitle) {
      return shortTitle;
    }
    
    let name = synopsis.name || '';
    
    // If it's a parallel source, shorten the name
    if (synopsis.type === SourceType.PARALLEL_SOURCE && synopsis.button_code) {
      name = shortenParallelSourceName(name, synopsis.button_code);
    }

    return name;
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead></TableHead>
        <TableBody>
          {synopsis.map((synopsisRow, i: number) => {
            const sublineData = {
              line: +lineNumber,
              subline: subline,
              synopsisCode: synopsisRow.id,
            };
            const imageUrl = getImageUrl(manuscriptsForChapter, sublineData);
            const rawText = getSynopsisRaw(synopsisRow);
            return rawText ? (
              <TableRow key={i}>
                <Tooltip enterDelay={800} leaveDelay={200} title={sourceFullName(synopsisRow)}>
                  <TableCell style={{ fontWeight: 'bold' }} component="td" scope="row">
                    <ButtonUnstyled
                      disabled={!imageUrl}
                      onClick={() => {
                        setSublineData({ ...sublineData, imageUrl });
                      }}>
                      {sourceName(synopsisRow)}
                    </ButtonUnstyled>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(SynopsisTable);
