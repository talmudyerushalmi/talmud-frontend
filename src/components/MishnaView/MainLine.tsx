import { Box } from '@mui/material';
import React, { lazy, ReactElement } from 'react';
import SublineDisplay from './SublineDisplay';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import { iLine } from '../../types/types';
import SugiaButton from './SugiaButton';
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
}

const MainLine = (props: Props) => {
  const { line, lineIndex, userAuth, isAuthenticated } = props;
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
              return (
                <div key={index}>
                  {subline.sugiaName ? <SugiaButton line={line} subline={subline} /> : null}
                  <SublineDisplay
                    key={index}
                    lineNumber={line.lineNumber}
                    lineIndex={lineIndex}
                    subline={subline}
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
