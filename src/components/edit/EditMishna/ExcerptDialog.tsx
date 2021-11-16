import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import FormikExcerpt from "./FormikExcerpt"
import { makeStyles } from "@material-ui/core"
import { EditorSelectionObject } from "../../../inc/editorUtils"
import { connect } from "react-redux"
import { iExcerpt } from "../../../types/types"
import FormikNosach from "./FormikNosach"

export enum EXCERPT_TYPE {
  MUVAA = "MUVAA",
  MAKBILA = "MAKBILA",
  NOSACH = "NOSACH",
  BIBLIO = "BIBLIO",
  INTERPRETATION = "INTERPRETATION"
} 
const GROUP_NOSACH = [EXCERPT_TYPE.NOSACH, EXCERPT_TYPE.BIBLIO, EXCERPT_TYPE.INTERPRETATION];
const GROUP_MAKBILA = [EXCERPT_TYPE.MAKBILA, EXCERPT_TYPE.MUVAA];


const useStyles = makeStyles(theme => ({
  container: {
    width: "80%",
    maxWidth: "initial",
  },
}))

const mapStateToProps = (state) => ({
  excerptDialogOpen: state.mishnaEdit.excerptDialogOpen,
  editedExcerpt: state.mishnaEdit.editedExcerpt
});

// const mapDispatchToProps = (dispatch, ownProps) => ({
//   getCompositions: () => {
//     dispatch(requestCompositions());
//   },
// });


interface Props {
  onAdd: Function;
  dialogOpen: boolean;
  onClose: Function;
  editedExcerpt: iExcerpt;
  selection: EditorSelectionObject,
  compositions: any;
  mishna: any;
}
const ExcerptDialog = (props: Props) => {
  const classes = useStyles()
  const { onAdd, dialogOpen, onClose, editedExcerpt, mishna,compositions } = props
  const selection = editedExcerpt ? editedExcerpt.selection : {}

  const selectionInfo = `משורה ${selection!.fromLine}, "${selection!.fromWord}"  עד שורה ${selection!.toLine}, "${selection!.toWord}"`;
  const handleClose = e => {
    console.log('handle close')
    // check if synthetic event or excerpt
    if (e && ['MUVAA','MAKBILA'].includes(e.type)) {
      onAdd(e)
    }
    onClose()
  }

  const FormToShow = (editedExcerpt) => {
    if (!editedExcerpt) { return null}
    if (editedExcerpt?.type && GROUP_MAKBILA.includes(editedExcerpt.type as EXCERPT_TYPE)) {
      return (
        <FormikExcerpt
        mishna={mishna}
        compositions={compositions}
        excerpt={editedExcerpt}
        selection={selection}
        name={"passing name"}
        handleSubmit={values => console.log('handle submitting',values)}
        handleClose={values => handleClose(values)}
      ></FormikExcerpt>
      );}
     if (editedExcerpt.type && GROUP_NOSACH.includes(editedExcerpt.type as EXCERPT_TYPE)) {
       return (
        <FormikNosach
        mishna={mishna}
        compositions={compositions}
        excerpt={editedExcerpt}
        selection={selection}
        name={"passing name"}
        handleSubmit={values => console.log('handle submitting',values)}
        handleClose={values => handleClose(values)}
      ></FormikNosach>
       )
     } 
    
  }
  return (
    <div>
      <Dialog
        classes={{
          paper: classes.container,
        }}
        style={{ minWidth: "80%", direction: "rtl" }}
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">עריכת קטע טקסט</DialogTitle>
        <DialogContent>
        <p>{selectionInfo}</p>
         { FormToShow(editedExcerpt) }
          <DialogContentText></DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default connect(mapStateToProps)(ExcerptDialog)
