import React from "react"
import { Typography } from "@mui/material"
const MarkedText = (props) => {
    const { text, className, from, to } = props

    if ( to === undefined) {
        return  <Typography component="span" className={className}>{text}</Typography>
    }
    
    const beforeMark = from > 0 ? 
      <Typography 
      component="span"
      className={className}>{text.slice(0,from)}</Typography> : null;
    const markedText =  
      <Typography 
      component="span"
      style={{background:"#ce9ce8"}}
      className={className}>{text.slice(from,to)}</Typography>;
    const afterMark = text.length > to ?
    <Typography 
    component="span"
    className={className}>{text.slice(to)}</Typography> : null;

    return (
        <>
        {beforeMark}
        {markedText}
        {afterMark}
        </>
    )
}
export default MarkedText
