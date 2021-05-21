import {
  Accordion,
  AccordionDetails,
  Button,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core"
import React, { useEffect, useState } from "react"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import draftToHtml from "draftjs-to-html"
import { connect } from "react-redux"
import { selectExcerpt } from "../../store/actions"
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import { getExcerpt, isContentEmpty } from "../../inc/editorUtils"
import { getSelectionRange } from "../../inc/excerptUtils"

const mapStateToProps = state => ({
  selectedSublineData: state.mishnaView.selectedSublineData,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectExcerpt: (sublineData, lineIndex) => {
    dispatch(selectExcerpt(sublineData, lineIndex))
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

const ExcerptView = props => {
  const classes = useStyles()
  const { excerpt, expanded, selectExcerpt } = props
  const key = excerpt.key
  const [expandedState, setExpanded] = useState(false)

  useEffect(() => {
    setExpanded(expanded ? excerpt.key : false)
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
 

  return (
    <>
      <Accordion
        square
        expanded={expandedState === key}
        onChange={handleChange(key)}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <IconButton
          className={classes.detailsButton}
            onClick={e => {
              e.stopPropagation()
              selectExcerpt(excerpt)
            }}
          >
            <MoreHorizIcon />
          </IconButton>
          <div>
            <Typography component="span">[{selectionRange}] </Typography>
            <Typography style={{fontWeight:'bold'}} component="span">{excerpt.source.title} </Typography>
            <Typography component="span">{excerpt.sourceLocation}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div dangerouslySetInnerHTML={{ __html: markupShortQuote}}></div>
        </AccordionDetails>
      </Accordion>
    </>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(ExcerptView)
