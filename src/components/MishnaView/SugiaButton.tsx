import React, { useRef } from 'react';
import { Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { iLine, iMishna, iSubline } from '../../types/types';
import { connect } from 'react-redux';
import { selectSublines } from '../../store/actions';
import { getSugiaLines } from '../../inc/mishnaUtils';
import * as _ from 'lodash';

export class counter { // todo - maybe replace with context
  static map = new Map();
  static last = 0;
  static reset() {
    counter.last = 0;
    counter.map.clear();
  }
  static get(i: number) {
    let index = counter.map.get(i);
    if (!index) {
      counter.last++;
      counter.map.set(i, counter.last);
      return counter.last;
    } else {
      return index;
    }
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'none',
    color: '#595959',
    border: 'none',
    padding: 0,
    font: 'inherit',
    cursor: 'pointer',
    outline: 'inherit',
    display: 'block',
    margin: '0 auto',
  },
  wrap: {
    marginTop: '0.6rem',
    marginBottom: '0.3rem',
    borderBottom: '1px solid #595959',
  },
  space: {
    marginTop: '0.6rem',
    marginBottom: '0.3rem',
  },
}));

const mapDispatchToProps = (dispatch: any) => ({
  selectSublines: (lineData) => {
    dispatch(selectSublines(lineData));
  },
});

const mapStateToProps = (state) => ({
  selectedSublines: state.mishnaView.selectedSublines,
  showSugiaName: state.mishnaView.showSugiaName,
  currentMishna: state.navigation.currentMishna,
});
interface Props {
  line: iLine;
  subline: iSubline;
  selectSublines: Function;
  selectedSublines: iSubline[];
  currentMishna: iMishna;
  showSugiaName: boolean;
}
const SugiaButton = (props: Props) => {
  const classes = useStyles();
  const { line, selectSublines, currentMishna, selectedSublines, showSugiaName, subline } = props;
  let l = line?.sublines ? line?.sublines[0] : null;

  const selectSugiaHandler = () => {
    const sugiaSublines = getSugiaLines(currentMishna, subline);
    const diff = _.difference(sugiaSublines, selectedSublines);
    if (diff.length === 0) {
      selectSublines([]);
    } else {
      selectSublines(sugiaSublines);
    }
  };

  const Button = () => {
    return (
      <button onClick={selectSugiaHandler} className={classes.root}>
        <div className={classes.wrap}>
          <Typography align="center">
            [{counter.get(subline.index)}]{subline.sugiaName?.trim() !== '' ? ' ' + subline.sugiaName : null}
          </Typography>
        </div>
      </button>
    );
  };

  const Title = () => {
    return (
      <div className={classes.space}>
        <Typography align="center">
          <Tooltip title={subline.sugiaName as string}>
            <span>---</span>
          </Tooltip>
        </Typography>
      </div>
    );
  };
  return <>{showSugiaName ? Button() : Title()}</>;
};

export default connect(mapStateToProps, mapDispatchToProps)(SugiaButton);
