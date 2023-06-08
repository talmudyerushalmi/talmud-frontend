import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormikExcerpt from './FormikExcerpt';
import { EditorSelectionObject } from '../../../inc/editorUtils';
import { connect } from 'react-redux';
import { iExcerpt } from '../../../types/types';
import FormikNosach from './FormikNosach';

export enum EXCERPT_TYPE {
  MUVAA = 'MUVAA',
  MAKBILA = 'MAKBILA',
  NOSACH = 'NOSACH',
  BIBLIO = 'BIBLIO',
  EXPLANATORY = 'EXPLANATORY',
  DICTIONARY = 'DICTIONARY',
  COMMENT = 'COMMENT',
}

const GROUP_NOSACH = [EXCERPT_TYPE.NOSACH, EXCERPT_TYPE.BIBLIO, EXCERPT_TYPE.EXPLANATORY, EXCERPT_TYPE.DICTIONARY];
const GROUP_MAKBILA = [EXCERPT_TYPE.MAKBILA, EXCERPT_TYPE.MUVAA];

const mapStateToProps = (state) => ({
  excerptDialogOpen: state.mishnaEdit.excerptDialogOpen,
  editedExcerpt: state.mishnaEdit.editedExcerpt,
});

interface Props {
  onAdd: Function;
  dialogOpen: boolean;
  onClose: Function;
  editedExcerpt: iExcerpt;
  selection: EditorSelectionObject;
  compositions: any;
  mishna: any;
}
const ExcerptDialog = (props: Props) => {
  const { onAdd, dialogOpen, onClose, editedExcerpt, mishna, compositions } = props;
  const selection = editedExcerpt ? editedExcerpt.selection : {};

  const selectionInfo = `משורה ${selection!.fromLine}, "${selection!.fromWord}" (${selection?.fromWordOccurence}/${
    selection?.fromWordTotal
  })
    עד שורה ${selection!.toLine}, "${selection!.toWord}" (${selection?.toWordOccurence}/${selection?.toWordTotal})`;
  const handleClose = (e) => {
    // check if synthetic event or excerpt
    if (e && ['MUVAA', 'MAKBILA'].includes(e.type)) {
      onAdd(e);
    }
    onClose();
  };

  const FormToShow = (editedExcerpt) => {
    if (!editedExcerpt) {
      return null;
    }
    if (editedExcerpt?.type && GROUP_MAKBILA.includes(editedExcerpt.type as EXCERPT_TYPE)) {
      return (
        <FormikExcerpt
          mishna={mishna}
          compositions={compositions}
          excerpt={editedExcerpt}
          selection={selection}
          name={'passing name'}
          handleSubmit={(values) => console.log('handle submitting', values)}
          handleClose={(values) => handleClose(values)}
        ></FormikExcerpt>
      );
    }
    if (editedExcerpt.type && GROUP_NOSACH.includes(editedExcerpt.type as EXCERPT_TYPE)) {
      return (
        <FormikNosach
          mishna={mishna}
          compositions={compositions}
          excerpt={editedExcerpt}
          selection={selection}
          name={'passing name'}
          handleSubmit={(values) => console.log('handle submitting', values)}
          handleClose={(values) => handleClose(values)}
        ></FormikNosach>
      );
    }
  };
  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth="xl"
        style={{ direction: 'rtl' }}
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">עריכת קטע טקסט</DialogTitle>
        <DialogContent>
          <p>{selectionInfo}</p>
          {FormToShow(editedExcerpt)}
          <DialogContentText></DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default connect(mapStateToProps)(ExcerptDialog);
