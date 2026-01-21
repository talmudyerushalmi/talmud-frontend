import React, { useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import MainLine from './MainLine';
import { iLine } from '../../types/types';
import { counter } from './SugiaButton';
import { useParams, Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { routeObject } from '../../store/reducers/navigationReducer';
import { connect } from 'react-redux';
import { UserGroup } from '../../store/reducers/authReducer';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  lineNumber: {
    //@ts-ignore
    ...theme.typography.lineNumber,
  },
  sourceReference: {
    //@ts-ignore
    ...theme.typography.sourceReference,
  },
  lines: {
    position: 'relative',
  },
}));

const mapStateToProps = (state: any) => ({
  userGroup: state.authentication.userGroup,
});

interface Props {
  lines: iLine[];
  userGroup: any;
  mishna: string;
  dafAmudMarkers?: Array<{
    line: string;
    word_pos: number;
    daf: string;
    amud: string;
  }>;
}
const MainLines = (props: Props) => {
  const classes = useStyles();
  const { lines, userGroup, mishna, dafAmudMarkers } = props;

  useEffect(()=>{
    counter.reset();
  },[lines])

  const route = useParams<routeObject>();
  if (!lines) {
    return null;
  }

  return (
    <div className={classes.root}>
      {lines.map((line, index) => {
        // Find marker that matches this line's lineNumber (using system_line)
        const marker = dafAmudMarkers?.find(m => m.line === line.lineNumber);
        
        return (
          <div key={line.lineNumber} className={classes.lines}>
            {userGroup === UserGroup.Editor ? (
              <IconButton
                component={Link}
                to={`/admin/edit/${route.tractate}/${route.chapter}/${mishna}/${line.lineNumber}/`}
                sx={{ position: 'absolute', display: { xs: 'none', sm: 'block' }, left: '-3rem', top: '-0.2rem' }}
                size="small">
                <Edit></Edit>
              </IconButton>
            ) : null}
            <MainLine key={line.lineNumber} lineIndex={index} line={line} dafAmudMarker={marker} />
          </div>
        );
      })}
    </div>
  );
};

export default connect(mapStateToProps)(MainLines);
