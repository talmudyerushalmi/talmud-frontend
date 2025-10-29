import React from 'react';
import { Button, Grid, useTheme, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SynopsisTextEditor from './SynopsisTextEditor';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { iSynopsis, SourceType } from '../../types/types';

const useStyles = makeStyles((theme) => ({
  narrow: { ...theme.buttons.narrow },
  editor: {
    '& .RichEditor-root': { padding: '5px' },
  },
  parallelReadonly: {
    backgroundColor: theme.palette.grey[300],
    border: `2px solid ${theme.palette.grey[400]}`,
    opacity: 0.8,
    '& .RichEditor-root': { 
      padding: '5px',
      backgroundColor: theme.palette.grey[200],
    },
  },
  parallelLabel: {
    color: '#666',
    fontWeight: 'bold',
  },
  normalLabel: {
    color: 'inherit',
    fontWeight: 'normal',
  },
}));

interface Props {
  source: iSynopsis;
  onChange: Function;
  onDelete: (e)=>void;
}

/**
 * Shortens parallel source description
 * Example: "סוטה ב ה [00175] - כתב יד ליידן" -> "סוטה ב ה - ל"
 */
const shortenParallelSourceName = (name: string): string => {
  // Pattern: "tractate chapter mishna [lineNumber] - sourceName"
  const match = name.match(/^(.+?)\s+\[[\d]+\]\s+-\s+(.+)$/);
  
  if (!match) {
    return name; // Return original if pattern doesn't match
  }
  
  const tractateChapterMishna = match[1]; // "סוטה ב ה"
  const sourceName = match[2]; // "כתב יד ליידן"
  
  // Map of source abbreviations
  const sourceAbbreviations: { [key: string]: string } = {
    'כתב יד ליידן': 'ל',
    'כתב יד רומי': 'ר',
    'דפוס ראשון': 'ד',
    'קריאה 2': 'כ2',
  };
  
  const abbreviatedSource = sourceAbbreviations[sourceName] || sourceName;
  
  return `${tractateChapterMishna} - ${abbreviatedSource}`;
};

const SynopsisField = (props: Props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { source, onChange, onDelete } = props;
  
  // Check if this is a parallel source that should be read-only
  const isParallelSource = source.type === SourceType.PARALLEL_SOURCE;
  
  const _onChange = (e) => {
    // Prevent changes for parallel sources
    if (isParallelSource) {
      return;
    }
    
    onChange({
      ...source,
      text: e,
    });
  };
  
  // Get display name (shortened for parallel sources, original for others)
  const displayName = isParallelSource 
    ? shortenParallelSourceName(source.name) 
    : source.name;
  
  // Full name for tooltip (only for parallel sources)
  const fullName = isParallelSource ? source.name : null;

  return (
    <>
      <Grid container>
        <Grid item sx={{...theme.layout.centerFlex,  minWidth: '10rem', marginRight: '1rem'}}>
          {source.type === 'indirect_sources' && !isParallelSource ? (
            <Button onClick={onDelete} className={classes.narrow}>
              <HighlightOffIcon />
            </Button>
          ) : null}
          {fullName ? (
            <Tooltip title={fullName} arrow placement="top">
              <span className={isParallelSource ? classes.parallelLabel : classes.normalLabel}>
                {displayName} {source.location}
              </span>
            </Tooltip>
          ) : (
            <span className={isParallelSource ? classes.parallelLabel : classes.normalLabel}>
              {displayName} {source.location}
            </span>
          )}
        </Grid>
        <Grid 
          item 
          style={{ flexGrow: 1 }} 
          className={isParallelSource ? classes.parallelReadonly : classes.editor}
        >
          <SynopsisTextEditor
            source={source}
            value={source.text}
            readOnly={isParallelSource}
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
