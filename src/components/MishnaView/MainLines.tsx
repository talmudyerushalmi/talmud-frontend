import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MainLine from "./MainLine";
import { iLine } from "../../types/types";
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
  smallTitle: {
    //@ts-ignore
    ...theme.typography.smallTitle,
    marginBottom: "1rem",
    marginTop: "1rem",
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
              <Typography align="center" className={classes.smallTitle}>
                [{sectionsIndex++} {line.sugiaName}]
              </Typography>
            ) : null}
            <MainLine lineIndex={index} line={line} />
          </div>
        );
      })}
    </div>
  );
};

export default MainLines;
