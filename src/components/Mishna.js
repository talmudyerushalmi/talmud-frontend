import React from 'react';
import { Paper, Typography } from "@material-ui/core"

const Mishna = (props)=>{

  const { text } = props;
  return (
    <Paper >
      <div style={{padding: '1rem'}}>
        <Typography variant="h5"
                   >משנה</Typography>
        <Typography variant="p"
                    >{text}</Typography>
      </div>
    </Paper>
  )

}

export default Mishna;
