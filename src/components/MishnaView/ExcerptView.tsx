import { Accordion, AccordionDetails, IconButton, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect, useState } from "react"
import AccordionSummary from "@mui/material/AccordionSummary"
import draftToHtml from "draftjs-to-html"
import { connect } from "react-redux"
import { selectExcerpt } from "../../store/actions"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import { getExcerpt, isContentEmpty } from "../../inc/editorUtils"
import { getSelectionRange } from "../../inc/excerptUtils"
import { iExcerpt } from "../../types/types";

const mapStateToProps = state => ({
  selectedSublineData: state.mishnaView.selectedSublineData,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectExcerpt: (sublineData) => {
    dispatch(selectExcerpt(sublineData))
  },
})

const useStyles = makeStyles(theme => ({
  sourceReference: {
    ...theme.typography.sourceReference,
  },
  detailsButton: {
   // position:'absolute',
   // top:'0',
   // left:'0',
    color: '#9863aa63',
    padding:'0'
  }
}))

interface Props {
  excerpt: iExcerpt;
  expanded: boolean;
  selectExcerpt: Function;

}
const ExcerptView = (props: Props) => {
  const classes = useStyles()
  const { excerpt, expanded, selectExcerpt } = props
  const key = excerpt.key
  const [expandedState, setExpanded] = useState<number|null>(null)

  useEffect(() => {
    setExpanded(expanded ? excerpt.key : null)
  }, [expanded])

  const handleChange = panel => (event, newExpanded) => {
    //selectExcerpt(excerpt);
    if (excerpt.editorStateShortQuote) {
      setExpanded(newExpanded ? panel : false)
    }
  }

  let markupShortQuote =  isContentEmpty(excerpt.editorStateShortQuote) ?
   getExcerpt(excerpt.editorStateFullQuote,20)
  : draftToHtml(excerpt.editorStateShortQuote)

  const markupFullQuote = draftToHtml(excerpt.editorStateFullQuote)
  const selectionRange = getSelectionRange(excerpt);
 

  return <>
    <Accordion
      square
      expanded={expandedState === key}
      onChange={handleChange(key)}
    >
      <AccordionSummary 
      className={excerpt.link ? "linked-excerpt" : ""}
      onClick={()=>{
        if (excerpt.link) {
          window.open(excerpt.link, '_blank')?.focus();
        }
      }}
      sx={{
        color: excerpt.link ? 'blue' : 'black',
        cursor: excerpt.link ? 'pointer' : 'auto !important'

      }}
      aria-controls="panel1d-content" id="panel1d-header">
        <IconButton
          className={classes.detailsButton}
          onClick={e => {
            e.stopPropagation()
            selectExcerpt(excerpt)
          }}
          size="small">
          <MoreHorizIcon />
        </IconButton>
        <div>
          <Typography component="span">[{selectionRange}] </Typography>
          <Typography style={{fontWeight:'bold'}} component="span">{excerpt.source?.title} </Typography>
          <Typography component="span">{excerpt.sourceLocation}</Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div dangerouslySetInnerHTML={{ __html: markupShortQuote}}></div>
      </AccordionDetails>
    </Accordion>
  </>;
}
export default connect(mapStateToProps, mapDispatchToProps)(ExcerptView)