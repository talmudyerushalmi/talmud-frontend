import React, { useCallback, useEffect, useRef } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import MainLine from './MainLine';
import { iLine, iSubline, DafAmudMarker } from '../../types/types';
import { counter } from './SugiaButton';
import { useParams, Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { routeObject } from '../../store/reducers/navigationReducer';
import { connect } from 'react-redux';
import { UserGroup } from '../../store/reducers/authReducer';
import { ShowEditType } from '../../store/reducers/mishnaViewReducer';
import { TaggingSubline } from '../../services/tagging.service';
import CategoryConnectionLines from './CategoryConnectionLines';
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
  showEditType: state.mishnaView.showEditType,
  taggedDetailedView: state.mishnaView.taggedDetailedView,
  taggingData: state.mishnaView.taggingData as TaggingSubline[],
  selectedTaggedSubline: state.mishnaView.selectedTaggedSubline as number | null,
  selectedSublines: state.mishnaView.selectedSublines as iSubline[],
});

interface Props {
  lines: iLine[];
  userGroup: any;
  mishna: string;
  dafAmudMarkers?: DafAmudMarker[];
  showEditType: ShowEditType;
  taggedDetailedView: boolean;
  taggingData: TaggingSubline[];
  selectedTaggedSubline: number | null;
  selectedSublines: iSubline[];
}
const MainLines = (props: Props) => {
  const classes = useStyles();
  const { lines, userGroup, mishna, dafAmudMarkers, showEditType, taggedDetailedView, taggingData, selectedTaggedSubline, selectedSublines } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const sublineRefsRef = useRef(new Map<number, HTMLElement>());

  const registerSublineRef = useCallback((index: number, el: HTMLElement | null) => {
    if (el) {
      sublineRefsRef.current.set(index, el);
    } else {
      sublineRefsRef.current.delete(index);
    }
  }, []);

  const isTaggedDetailed = showEditType === ShowEditType.TAGGED && taggedDetailedView;

  const activeConnectionData = React.useMemo(() => {
    if (!isTaggedDetailed) return [];
    const activeIndices = new Set<number>();
    if (selectedTaggedSubline !== null) activeIndices.add(selectedTaggedSubline);
    for (const s of selectedSublines) activeIndices.add(s.index);
    if (activeIndices.size === 0) return [];
    return taggingData.filter(t => activeIndices.has(t.index));
  }, [isTaggedDetailed, selectedTaggedSubline, selectedSublines, taggingData]);

  useEffect(()=>{
    counter.reset();
  },[lines])

  const route = useParams<routeObject>();
  if (!lines) {
    return null;
  }

  return (
    <div className={classes.root} ref={containerRef} style={{ position: 'relative' }}>
      {isTaggedDetailed && activeConnectionData.length > 0 && (
        <CategoryConnectionLines
          taggingData={activeConnectionData}
          sublineRefs={sublineRefsRef.current}
          containerRef={containerRef}
        />
      )}
      {lines.map((line, index) => {
        const marker = dafAmudMarkers?.find(m => m.line === line.lineNumber);
        
        return (
          <div key={line.lineNumber} className={classes.lines}>
            {userGroup === UserGroup.Editor ? (
              <IconButton
                component={Link}
                to={`/admin/edit/${route.tractate}/${route.chapter}/${mishna}/${line.lineNumber}`}
                sx={{ position: 'absolute', display: { xs: 'none', sm: 'block' }, left: '-3rem', top: '-0.2rem' }}
                size="small">
                <Edit></Edit>
              </IconButton>
            ) : null}
            <MainLine
              key={line.lineNumber}
              lineIndex={index}
              line={line}
              dafAmudMarker={marker}
              registerSublineRef={registerSublineRef}
            />
          </div>
        );
      })}
    </div>
  );
};

export default connect(mapStateToProps)(MainLines);
