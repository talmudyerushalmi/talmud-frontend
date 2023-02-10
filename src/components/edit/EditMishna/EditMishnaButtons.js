import { Button, useTheme } from '@mui/material';
import React from 'react';
import { EXCERPT_TYPE } from './ExcerptDialog';


const EditMishnaButtons = (props) => {
  const theme = useTheme();

  const { onAddNewExcerpt } = props;

  return (
    <div style={{
      position: 'sticky',
      top: '5.5rem',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: theme.palette.background
    }}>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          onAddNewExcerpt({ type: EXCERPT_TYPE.MUVAA });
        }}
      >
        הוסף מובאה
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          onAddNewExcerpt({ type: EXCERPT_TYPE.MAKBILA });
        }}
      >
        הוסף מקבילה
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          onAddNewExcerpt({ type: EXCERPT_TYPE.NOSACH });
        }}
      >
        הערת נוסח
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          onAddNewExcerpt({ type: EXCERPT_TYPE.BIBLIO });
        }}
      >
        הערה ביבליוגרפית
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          onAddNewExcerpt({ type: EXCERPT_TYPE.EXPLANATORY });
        }}
      >
        הערה פרשנית
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          onAddNewExcerpt({ type: EXCERPT_TYPE.DICTIONARY });
        }}
      >
        מילון
      </Button>
    </div>
  );
};

export default EditMishnaButtons;
