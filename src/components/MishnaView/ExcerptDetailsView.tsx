import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import draftToHtml from 'draftjs-to-html';
import { Card, IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { getSelectionRange } from '../../inc/excerptUtils';
import { iExcerpt } from '../../types/types';
import LinkIcon from '@mui/icons-material/Link';

const useStyles = makeStyles({
  root: {
    padding: '1rem',
  },
  content: {
    marginTop: '1rem',
    maxHeight: 'calc(100% - 7rem)',
    overflow: 'auto',
    '& p': { margin: 0 },
  },
  openCard: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    textAlign: 'initial',
    opacity: 100,
    zIndex: 9,
    height: '100%',
    padding: '1rem',
  },
  closedCard: {
    opacity: 0,
    display: 'none',
  },
});

interface Props {
  onClose: Function;
  open: boolean;
  selectedExcerpt: iExcerpt;
}
const ExcerptDetailsView = (props: Props) => {
  const classes = useStyles();
  const { onClose, open, selectedExcerpt } = props;

  const selectionRange = getSelectionRange(selectedExcerpt);

  const markupLongQuote = draftToHtml(selectedExcerpt?.editorStateFullQuote);

  const classRoot = open ? classes.openCard : classes.closedCard;

  return (
    <Card className={classRoot} dir="rtl" aria-labelledby="simple-dialog-title">
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        size="large"
      >
        <CancelIcon />
      </IconButton>
      {selectedExcerpt?.link ? (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            window.open(selectedExcerpt.link, '_blank')?.focus();
          }}
          size="small"
        >
          <LinkIcon />
        </IconButton>
      ) : null}
      <Typography variant="h3" style={{ fontWeight: 'bold' }}>
        {selectedExcerpt?.source?.title}
        <Typography component="span"> {selectedExcerpt?.sourceLocation}</Typography>
      </Typography>
      <Typography>[{selectionRange}]</Typography>

      <div className={classes.content} dangerouslySetInnerHTML={{ __html: markupLongQuote }}></div>
    </Card>
  );
};

export default ExcerptDetailsView;
