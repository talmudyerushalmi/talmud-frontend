import { Button } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { EXCERPT_TYPE } from "./ExcerptDialog";

const useStyles = makeStyles(theme => ({
    root: {
        position: 'sticky',
        top: '5.5rem',
        background: 'white',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
  }))
const EditMishnaButtons = (props)=>{

    const classes = useStyles();
    const { onAddNewExcerpt } = props;

    return (
        <div className={classes.root}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            onAddNewExcerpt({type: EXCERPT_TYPE.MUVAA})
          }}
        >
          הוסף מובאה
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            onAddNewExcerpt({type: EXCERPT_TYPE.MAKBILA})
          }}
        >
          הוסף מקבילה
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            onAddNewExcerpt({type: EXCERPT_TYPE.NOSACH})
          }}
        >
          הערת נוסח
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            onAddNewExcerpt({type: EXCERPT_TYPE.BIBLIO})
          }}
        >
          הערה ביבליוגרפית
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            onAddNewExcerpt({type: EXCERPT_TYPE.EXPLANATORY})
          }}
        >
          הערה פרשנית
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            onAddNewExcerpt({type: EXCERPT_TYPE.DICTIONARY})
          }}
        >
          מילון
        </Button>
      </div>
    )
}

export default EditMishnaButtons;