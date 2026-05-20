import { Box } from '@mui/material';
import React from 'react';
import SublineDisplay from './SublineDisplay';
import { connect } from 'react-redux';
import { iLine, DafAmudMarker } from '../../types/types';
import SugiaButton from './SugiaButton';
import { UserGroup } from '../../store/reducers/authReducer';

const mapStateToProps = (state) => ({
  isAuthenticated: state.authentication.userGroup !== UserGroup.Unauthenticated,
});

interface Props {
  line: iLine;
  lineIndex: number;
  isAuthenticated: boolean;
  dafAmudMarker?: DafAmudMarker;
  registerSublineRef?: (index: number, el: HTMLElement | null) => void;
}

const MainLine = (props: Props) => {
  const { line, lineIndex, isAuthenticated, dafAmudMarker, registerSublineRef } = props;
  const [hoverSubline, setHoverSubline] = React.useState<number>(-1);
  const handleMouseLeave = () => {
    setTimeout(() => {
      setHoverSubline(-1);
    }, 2000);
  };

  const handleMouseEnter = (subline: number) => {
    setHoverSubline(subline);
  };

  const hoverProps = {
    hoverSubline,
    handleMouseLeave,
    handleMouseEnter,
  };

  return (
    <Box style={{ position: 'relative' }}>
      {line?.sublines
        ? line.sublines.map((subline, index) => {
            // Only pass marker to the first subline
            const markerForSubline = index === 0 ? dafAmudMarker : undefined;

            return (
              <div
                key={index}
                ref={registerSublineRef ? (el) => registerSublineRef(subline.index, el) : undefined}
              >
                {subline.sugiaName ? <SugiaButton line={line} subline={subline} /> : null}
                <SublineDisplay
                  lineDetails={{
                    lineIndex,
                    lineNumber: line.lineNumber,
                    mainLine: line.mainLine,
                  }}
                  subline={subline}
                  dafAmudMarker={markerForSubline}
                  {...(isAuthenticated && hoverProps)}
                />
              </div>
            );
          })
        : null}
    </Box>
  );
};

export default connect(mapStateToProps)(MainLine);
