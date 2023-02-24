import React from 'react';
import { Button, Grid, useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SynopsisTextEditor from './SynopsisTextEditor';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { iSynopsis } from '../../types/types';

const useStyles = makeStyles((theme) => ({
  narrow: { ...theme.buttons.narrow },
  editor: {
    '& .RichEditor-root': { padding: '5px' },
  },
}));

interface Props {
  source: iSynopsis;
  onChange: Function;
  onDelete: (e)=>void;
}

const SynopsisField = (props: Props) => {
  const classes = useStyles();
  const theme = useTheme();
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
        <Grid item sx={{...theme.layout.centerFlex,  minWidth: '10rem', marginRight: '1rem'}}>
          {source.type === 'indirect_sources' ? (
            <Button onClick={onDelete} className={classes.narrow}>
              <HighlightOffIcon />
            </Button>
          ) : null}
          <span>
            {source.name} {source.location}
          </span>
        </Grid>
        <Grid item style={{ flexGrow: 1 }} className={classes.editor}>
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
