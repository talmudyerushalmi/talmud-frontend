import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { iLine } from "../../types/types";

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'none',
	color: 'inherit',
	border: 'none',
	padding: 0,
	font: 'inherit',
	cursor: 'pointer',
	outline: 'inherit'
  }, 
  smallTitle: {
    //@ts-ignore
    ...theme.typography.smallTitle,
  },
}));

interface Props {
    index: number;
    line: iLine;
}
const SugiaButton = (props: Props) => {
  const classes = useStyles();
  const { index, line } = props;

  return (
    <button className={classes.root}>
      <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <Typography align="center" className={classes.smallTitle}>
          [{index}]
        </Typography>
        <Typography align="center" className={classes.smallTitle}>
          {line.sugiaName}
        </Typography>
      </div>
    </button>
  );
};

export default SugiaButton;
