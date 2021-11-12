import { Button, Grid, makeStyles } from "@material-ui/core";
import React from "react";
import SynopsisTextEditor from "./SynopsisTextEditor";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

const useStyles = makeStyles((theme) => ({
  centerFlex: { ...theme.layout.centerFlex, minWidth:'10rem', marginRight:'1rem' },
  narrow: { ...theme.buttons.narrow },
}));

const SynopsisField = (props) => {
  const classes = useStyles();
  const { source, onChange, onDelete } = props;
  const _onChange = (e) => {
    onChange({
      ...source,
      text: e,
    });
  };

  return (
    <>
      <Grid container>
        <Grid item className={classes.centerFlex}>
        {source.type === "indirect_sources" ? (
            <Button onClick={onDelete} className={classes.narrow}>
              <HighlightOffIcon />
            </Button>
          ) : null}
          <span>
            {source.name} {source.location}
          </span>
        </Grid>
        <Grid item style={{flexGrow:1}}>
          <SynopsisTextEditor
            source={source}
            value={source.text}
            onChange={(editor) => {
              _onChange(editor);
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default SynopsisField;
