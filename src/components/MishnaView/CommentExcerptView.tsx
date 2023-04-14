import { Accordion, AccordionDetails, Typography } from '@mui/material';
import React, { useState } from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import { iComment } from '../../types/types';
import { connect } from 'react-redux';
import { setSelectedComment } from '../../store/actions/commentsActions';

interface Props {
  comment: iComment;
  expanded: boolean;
  setSelectedComment: (comment) => void;
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setSelectedComment: (comment) => {
    dispatch(setSelectedComment(comment));
  },
});

const CommentExcerptView = (props: Props) => {
  const { comment, setSelectedComment } = props;
  const [expandedState, setExpandedState] = useState<string | null>(null);

  // useEffect(() => {
  //   setExpandedState(expanded ? comment.commentID : null);
  // }, [expanded]);

  const handleClick = () => {
    if (!expandedState) {
      setExpandedState(comment.commentID);
    } else {
      setSelectedComment(comment);
      setExpandedState(null);
    }
  };

  return (
    <>
      <Accordion square expanded={expandedState === comment.commentID} onClick={handleClick}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <div>
            <Typography component="span">[{comment.subline}]</Typography>{' '}
            <Typography component="span">{comment.title}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div dangerouslySetInnerHTML={{ __html: comment?.text ?? '' }}></div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(CommentExcerptView);
