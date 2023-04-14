import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import { Box, Card, IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { CommentType, iComment } from '../../types/types';
import EditIcon from '@mui/icons-material/Edit';
import EditCommentsDialog from '../comments/EditCommentsDialog';
import { useAppDispatch } from '../../app/hooks';
import { updateComment } from '../../store/actions/commentsActions';

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
  selectedComment: iComment;
  privateCommentsByMishna: iComment[];
}

const CommentsExcerptDetailsView = (props: Props) => {
  const dispatch = useAppDispatch();

  const classes = useStyles();
  const { onClose, open, selectedComment,privateCommentsByMishna } = props;
  const [openModal, setOpenModal] = useState<boolean>(false);

  if (!selectedComment) return null;
  

  const classRoot = open ? classes.openCard : classes.closedCard;

  const handleUpdateSubmit = (comment: any) => {
    const updatedComment = {
      ...selectedComment,
      ...comment,
      type: comment.type === CommentType.PRIVATE ? CommentType.PRIVATE : CommentType.MODERATION,
    };

    dispatch(updateComment(updatedComment));
    setOpenModal(false);
    onClose();
  };

  const renderEditButton = privateCommentsByMishna.some((comment) => comment.commentID === selectedComment.commentID);

  return (
    <>
      <Card className={classRoot} dir="rtl" aria-labelledby="simple-dialog-title">
        <Box display="flex" justifyContent="space-between">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            size="large">
            <CancelIcon />
          </IconButton>
          {!!renderEditButton && (
            <IconButton
              onClick={(e) => {
                setOpenModal(true);
              }}>
              <EditIcon />
            </IconButton>
          )}
        </Box>
        <Typography variant="h3" style={{ fontWeight: 'bold' }}>
          שורה {selectedComment?.subline} - {selectedComment?.title}
        </Typography>
        <div className={classes.content} dangerouslySetInnerHTML={{ __html: selectedComment?.text || '' }}></div>
      </Card>
      <EditCommentsDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        submitHandler={handleUpdateSubmit}
        comment={selectedComment}
      />
    </>
  );
};

export default CommentsExcerptDetailsView;
