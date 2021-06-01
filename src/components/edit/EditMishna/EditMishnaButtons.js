import { Button, makeStyles } from "@material-ui/core";
import React from 'react';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        top: '10.5rem',
        background: 'white',
        zIndex: 1
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
            onAddNewExcerpt({type:'MUVAA'})
          }}
        >
          הוסף מובאה
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            onAddNewExcerpt({type:'MAKBILA'})
          }}
        >
          הוסף מקבילה
        </Button>
      </div>
    )
}

export default EditMishnaButtons;