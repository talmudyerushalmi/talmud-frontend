import React, { useRef } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import MainLine from './MainLine';
import { iLine } from '../../types/types';
import SugiaButton from './SugiaButton';
import { useNavigate, useParams } from 'react-router-dom';
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
}
const MainLines = (props: Props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { lines, userGroup, mishna } = props;

  const route = useParams<routeObject>();
  if (!lines) {
    return null;
  }

  return (
    <div className={classes.root}>
      {lines.map((line, index) => {
        return (
          <div key={line.lineNumber} className={classes.lines}>
            {line.lineNumber}
            {userGroup === UserGroup.Editor ? (
              <IconButton
                sx={{ position: 'absolute', display: { xs: 'none', sm: 'block' }, left: '-3rem', top: '-0.2rem' }}
                onClick={() => {
                  const url = `/admin/edit/${route.tractate}/${route.chapter}/${mishna}/${line.lineNumber}/`;
                  navigate(url);
                }}
                size="small">
                <Edit></Edit>
              </IconButton>
            ) : null}
            <MainLine key={line.lineNumber} lineIndex={index} line={line} />
          </div>
        );
      })}
    </div>
  );
};

export default connect(mapStateToProps)(MainLines);
