import React from "react";
 import { makeStyles } from '@material-ui/core/styles';
import  SublineDisplay  from "./SublineDisplay";
// import Tooltip from '@material-ui/core/Tooltip';
const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: "100%",
      direction: "rtl"
    },
  }
})

export const MainLineNew = (props)=>{
  const { line, lineIndex } =  props;
  const classes = useStyles();

  return (
    <>

            {
            line?.sublines ?    
            line.sublines.map((subline,index)=>{
                return (
                    <SublineDisplay
                      key={index}
                      lineIndex={lineIndex}
                      subline={subline}
                    />
                )
            }) : null
            }

    

    </>
  );
}

