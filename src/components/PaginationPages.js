import { navigate} from "gatsby"
import React from "react"
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const PaginationPages = ()=>{
  const classes = useStyles();

  const paginationChange = (e,n)=>{
    navigate(`/talmud/${n}`)
  }


  return (
    <div>
      <div
        style={{direction:'ltr'}}
        className={classes.root}>
        <Pagination
          onChange={(e,n)=>{paginationChange(e,n)}}
          count={5} />
      </div>

    </div>
  )
}

export default PaginationPages;
