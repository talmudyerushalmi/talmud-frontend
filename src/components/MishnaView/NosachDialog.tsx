import React, { useState } from 'react';
import { Theme } from '@mui/material/styles';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import { iLine } from '../../types/types';
import TextEditorLine from '../edit/EditMishna/TextEditorLine';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      textAlign: 'left',
      padding: theme.spacing(2),
    },
    editLineButton: {
      display: 'block',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

const useStyles = makeStyles({
  root: {
    margin: 0,
  },
  paperWidthSm: {
    maxWidth: '100%',
  },
});

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

interface Props {
  line: iLine;
}
const NosachDialog = (props: Props) => {
  const { line } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [sublines, setSublines] = useState<string[]>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = () => {
    if (sublines.length) {
      console.log('sublines ', sublines);
    }
  };

  const onLineChange = (sublines: string[]) => {
    setSublines(sublines);
  };

  return (
    <div>
      <IconButton aria-label="edit" onClick={handleClickOpen} size="large">
        <EditIcon />
      </IconButton>
      <Dialog
        fullWidth={true}
        style={{ maxWidth: 'none;' }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        classes={{
          paperWidthLg: classes.paperWidthSm,
          paperWidthMd: classes.paperWidthSm,
          paperWidthXl: classes.paperWidthSm,
          paperWidthSm: classes.paperWidthSm, // class name, e.g. `classes-nesting-label-x`
        }}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          ערוך שורה
        </DialogTitle>
        <DialogContent dividers>
          <TextEditorLine line={line} onChange={onLineChange} />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="secondary">
            בטל
          </Button>
          <Button autoFocus onClick={handleSave} color="primary">
            שמור
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NosachDialog;
