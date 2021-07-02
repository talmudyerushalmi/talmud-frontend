import { Box } from "@material-ui/core";
import React, { lazy, ReactElement } from "react";
import SublineDisplay from "./SublineDisplay";
import { connect } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";


const importView = component =>
  lazy(() =>
    import(`./${component}`)
  );


const mapStateToProps = (state) => ({
  userAuth: state.authentication.userAuth,
});
const mapDispatchToProps = (dispatch, ownProps) => ({});
const MainLine = (props) => {
  const { line, lineIndex, userAuth } = props;
  const [dynamicComponents, setdynamicComponents] = useState<ReactElement[]>([]);


  useEffect(() => {
    let dynamicComponentsToLoad = userAuth ? ['NosachDialog'] : [];
    async function loadViews() {
      const componentPromises =
      dynamicComponentsToLoad.map(async (component, index)=> {
          const View = await importView(component);
          return <View key={index}/>;
        });

      Promise.all(componentPromises).then(
        loaded =>{setdynamicComponents(loaded)}
      );
    }

    loadViews();
  }, [userAuth]);

  return (
    <>
      <Box style={{ position: "relative" }}>
        <React.Suspense fallback="">
          <div className="container">{dynamicComponents}</div>
        </React.Suspense>
        {line?.sublines
          ? line.sublines.map((subline, index) => {
              return (
                <SublineDisplay
                  key={index}
                  lineIndex={lineIndex}
                  subline={subline}
                />
              );
            })
          : null}
      </Box>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainLine);
