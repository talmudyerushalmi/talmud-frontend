import { Button, makeStyles } from "@material-ui/core";
import React from 'react';

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
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            onAddNewExcerpt({type:'NOSACH'})
          }}
        >
          הערת נוסח
        </Button>
      </div>
    )
}

export default EditMishnaButtons;