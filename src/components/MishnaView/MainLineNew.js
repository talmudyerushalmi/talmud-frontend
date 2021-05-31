import React from "react";
import  SublineDisplay  from "./SublineDisplay";


export const MainLineNew = (props)=>{
  const { line, lineIndex } =  props;


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

