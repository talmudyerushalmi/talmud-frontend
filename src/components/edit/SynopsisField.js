import { Button, Grid } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React from "react";
import SynopsisTextEditor from "./SynopsisTextEditor";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const useStyles = makeStyles((theme) => ({
  centerFlex: { ...theme.layout.centerFlex, minWidth:'10rem', marginRight:'1rem' },
  narrow: { ...theme.buttons.narrow },
  editor: {
    '& .RichEditor-root': {padding:'5px'}
  }
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
        <Grid item style={{flexGrow:1}} className={classes.editor}>
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
