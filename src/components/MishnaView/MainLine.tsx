import { Box } from '@mui/material';
import React, { lazy, ReactElement } from 'react';
import SublineDisplay, { subSugiaCounter } from './SublineDisplay';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import { iLine, DafAmudMarker } from '../../types/types';
import SugiaButton, { counter } from './SugiaButton';
import { UserGroup } from '../../store/reducers/authReducer';

const importView = (component) => lazy(() => import(`./${component}`));

const mapStateToProps = (state) => ({
  userAuth: state.authentication.userAuth,
  isAuthenticated: state.authentication.userGroup !== UserGroup.Unauthenticated,
});
const mapDispatchToProps = (dispatch, ownProps) => ({});
interface Props {
  line: iLine;
  lineIndex: number;
  userAuth: any;
  isAuthenticated: boolean;
  dafAmudMarker?: DafAmudMarker;
  allLines: iLine[]; // All lines in the mishna for cross-line sugia lookup
}

const MainLine = (props: Props) => {
  const { line, lineIndex, userAuth, isAuthenticated, dafAmudMarker, allLines } = props;
  const [dynamicComponents, setdynamicComponents] = useState<ReactElement[]>([]);
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

  // Helper function to find the current sugia for a given subline index
  // by searching backwards through all sublines across all lines
  const findCurrentSugia = (targetSublineIndex: number): number | undefined => {
    // Flatten all sublines from all lines
    const allSublines = allLines.flatMap(l => l.sublines || []);
    
    // Search backwards from the target subline to find the most recent sugia
    for (let i = targetSublineIndex - 1; i >= 0; i--) {
      const subline = allSublines[i];
      if (subline && subline.sugiaName) {
        return counter.get(subline.index);
      }
    }
    return undefined;
  };

  useEffect(() => {
    let dynamicComponentsToLoad = userAuth ? [] : [];
    async function loadViews() {
      const componentPromises = dynamicComponentsToLoad.map(async (component, index) => {
        const View = await importView(component);
        return <View key={index} line={line} />;
      });

      Promise.all(componentPromises).then((loaded) => {
        setdynamicComponents(loaded);
      });
    }

    loadViews();
  }, [userAuth, line]);

  return (
    <>
      <Box style={{ position: 'relative' }}>
        <React.Suspense fallback="">
          <div className="container">{dynamicComponents}</div>
        </React.Suspense>
        {line?.sublines
          ? line.sublines.map((subline, index) => {
              // Only pass marker to the first subline
              const markerForSubline = index === 0 ? dafAmudMarker : undefined;
              
              // Track current sugia number for sub-sugia numbering
              let currentSugiaNumber: number | undefined;
              if (subline.sugiaName) {
                // This is a new sugia - set it and reset sub-sugia counter
                currentSugiaNumber = counter.get(subline.index);
                subSugiaCounter.setSugia(subline.index);
              } else {
                // Find the current sugia by searching across all lines
                currentSugiaNumber = findCurrentSugia(subline.index);
              }
              
              return (
                <div key={index}>
                  {subline.sugiaName ? <SugiaButton line={line} subline={subline} /> : null}
                  <SublineDisplay
                    key={index}
                    lineDetails={{
                      lineIndex,
                      lineNumber: line.lineNumber,
                      mainLine: line.mainLine,
                    }}
                    subline={subline}
                    dafAmudMarker={markerForSubline}
                    currentSugiaNumber={currentSugiaNumber}
                    {...(isAuthenticated && hoverProps)}
                  />
                </div>
              );
            })
          : null}
      </Box>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainLine);
