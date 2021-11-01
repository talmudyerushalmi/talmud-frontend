import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MainLine from "./MainLine";
import { iLine } from "../../types/types";
import SugiaButton from "./SugiaButton";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  lineNumber: {
    //@ts-ignore
    ...theme.typography.lineNumber,
  },
  sourceReference: {
    //@ts-ignore
    ...theme.typography.sourceReference,
  },
}));

interface Props {
  lines: iLine[];
}
const MainLines = (props: Props) => {
  const classes = useStyles();
  const { lines } = props;
  let sectionsIndex = 1;

  if (!lines) {
    return null;
  }

  return (
    <div className={classes.root}>
      {lines.map((line, index) => {
        return (
          <div key={line.lineNumber}>
            {line.sugiaName ? (
              <SugiaButton index={sectionsIndex++} line={line} />
            ) : null}
            <MainLine lineIndex={index} line={line} />
          </div>
        );
      })}
    </div>
  );
};

export default MainLines;
