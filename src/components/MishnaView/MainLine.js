import { Typography } from "@material-ui/core"
import React from "react";
 import { makeStyles } from '@material-ui/core/styles';
// import Tooltip from '@material-ui/core/Tooltip';
const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: "100%",
      direction: "rtl"
    },
    lineroot:{
      display:'flex'
    },
    table: {
      width: "100%",
      direction: "rtl",
      '& th,td': {
        textAlign: 'right',
        direction: 'rtl'
        }
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular
    },
    expansion: {
      display: "block"
    },
    lineNumber: {
      ...theme.typography.lineNumber
    },
    sourceReference: {
      ...theme.typography.sourceReference
    }
  }
})
// const useStylesBootstrap = makeStyles((theme) => ({
//   arrow: {
//     color: theme.palette.common.black,
//   },
//   tooltip: {
//     backgroundColor: theme.palette.common.black,
//   },
// }));

// function BootstrapTooltip(props) {
//   const classes = useStylesBootstrap();

//   return <Tooltip arrow classes={classes} {...props} />;
// }

// const HtmlTooltip = withStyles((theme) => ({
//   tooltip: {
//     backgroundColor: '#f5f5f9',
//     direction: 'rtl',
//     color: 'rgba(0, 0, 0, 0.87)',
//     maxWidth: 220,
//     fontSize: theme.typography.pxToRem(12),
//     border: '1px solid #dadde9',
//   },
// }))(Tooltip);

export const MainLine = (props)=>{

  const { mainLine, lineNumber, sourceReference, text  } = props.line;
  console.log("ma")
  //console.log('props ',props);
  const classes = useStyles();

  return (
    <>
      {/* <HtmlTooltip
        title={
          <React.Fragment>
            <div dangerouslySetInnerHTML={{ __html: nosach }}/>
          </React.Fragment>
        }
      > */}
        <div className={classes.lineroot}>
          <Typography className={classes.heading}>{text}</Typography>
          {sourceReference ?
            <Typography className={classes.sourceReference}> ({sourceReference}) </Typography>
            : null}
        </div>
      {/* </HtmlTooltip> */}


    </>
  );
}

