import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import MainLine from './MainLine';
import { iLine } from '../../types/types';
import SugiaButton from './SugiaButton';
import { useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { routeObject } from '../../routes/AdminRoutes';
import { connect } from 'react-redux';
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
  username: state.authentication.username,
});

interface Props {
  lines: iLine[];
  username: any;
  mishna: string;
}
const MainLines = (props: Props) => {
  const classes = useStyles();
  const { lines, username, mishna } = props;
  let sectionsIndex = 1;

  const route = useParams<routeObject>();
  if (!lines) {
    return null;
  }

  return (
    <div className={classes.root}>
      {lines.map((line, index) => {
        return (
          <div key={line.lineNumber} className={classes.lines}>
            {username ? (
              <IconButton
                sx={{ position: 'absolute', display: { xs: 'none', sm: 'block' }, left: '-3rem', top: '-0.2rem' }}
                onClick={() => {
                  const url = `/admin/edit/${route.tractate}/${route.chapter}/${mishna}/${line.lineNumber}/`;
                  //@ts-ignore
                  window!.open(url, '_self').focus();
                }}
                size="small"
              >
                <Edit></Edit>
              </IconButton>
            ) : null}
            {line.sugiaName ? <SugiaButton index={sectionsIndex++} line={line} /> : null}
            <MainLine lineIndex={index} line={line} />
          </div>
        );
      })}
    </div>
  );
};

export default connect(mapStateToProps)(MainLines);
