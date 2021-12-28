import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import draftToHtml from "draftjs-to-html"
import { Card, IconButton } from "@material-ui/core"
import CancelIcon from '@material-ui/icons/Cancel';
import { getSelectionRange } from "../../inc/excerptUtils"

const useStyles = makeStyles({
  root: {
    padding: "1rem",
  },
  content: {
    marginTop: "1rem",
    maxHeight: "calc(100% - 7rem)",
    overflow: "auto",
    '& p': {margin:0}
  },
  openCard: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    textAlign: "initial",
    opacity: 100,
    zIndex: 9,
    height: "100%",
    padding: "1rem",
  },
  closedCard: {
    opacity: 0,
    display: "none",
  },
})

const ExcerptDetailsView = props => {
  const classes = useStyles()
  const { onClose, open, selectedExcerpt } = props

  const selectionRange = getSelectionRange(selectedExcerpt);

  const markupLongQuote = draftToHtml(selectedExcerpt?.editorStateFullQuote)

  const classRoot = open ? classes.openCard : classes.closedCard
  const handleClose = () => {
    onClose()
  }

  return (
    <Card
      className={classRoot}
      dir="rtl"
      //  transitionDuration={400}
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <IconButton
        className={classes.detailsButton}
        onClick={e => {
          e.stopPropagation()
          handleClose()
        }}
      >
        <CancelIcon />
      </IconButton>
      <Typography variant="h3" style={{fontWeight:'bold'}}>{selectedExcerpt?.source?.title}
      <Typography component="span"> {selectedExcerpt?.sourceLocation}</Typography>
      </Typography>
      <Typography>[{selectionRange}]</Typography>

      <div
        className={classes.content}
        dangerouslySetInnerHTML={{ __html: markupLongQuote }}
      ></div>
    </Card>
  )
}

export default ExcerptDetailsView

