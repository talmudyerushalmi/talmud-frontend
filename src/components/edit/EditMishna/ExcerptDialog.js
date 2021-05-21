import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import FormikUI from "./FormikUI"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  container: {
    width: "80%",
    maxWidth: "initial",
  },
}))

const ExcerptDialog = props => {
  const classes = useStyles()
  const { onAdd, dialogOpen, onClose, excerpt, selection , mishna,compositions } = props

  const selectionInfo = `משורה ${selection.fromLine}, "${selection.fromWord}"  עד שורה ${selection.toLine}, "${selection.toWord}"`;
  const handleClose = e => {
    // check if synthetic event or excerpt
    if (e && ['MUVAA','MAKBILA'].includes(e.type)) {
      onAdd(e)
    }
    onClose()
  }

  return (
    <div>
      <Dialog
        classes={{
          paper: classes.container,
        }}
        className={classes.root}
        style={{ minWidth: "80%", direction: "rtl" }}
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">הוסף מובאה/מקבילה</DialogTitle>
        <DialogContent>
        <p>{selectionInfo}</p>
          <FormikUI
            mishna={mishna}
            compositions={compositions}
            excerpt={excerpt}
            selection={selection}
            name={"passing name"}
            handleClose={values => handleClose(values)}
          ></FormikUI>
          <DialogContentText></DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ExcerptDialog
