import { Accordion, AccordionDetails, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import { selectExcerpt } from '../../store/actions';
import { iComment } from '../../types/types';
import { connect } from 'react-redux';
import { EXCERPT_TYPE } from '../edit/EditMishna/ExcerptDialog';

interface Props {
  comment: iComment;
  expanded: boolean;
  selectExcerpt: (comment) => void;
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectExcerpt: (sublineData) => {
    dispatch(selectExcerpt(sublineData));
  },
});

const CommentExcerptView = (props: Props) => {
  const { comment, expanded, selectExcerpt } = props;
  const [expandedState, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setExpanded(expanded ? comment.commentID : null);
  }, [expanded]);

  const handleClick = () => {
    if (!expandedState) {
      setExpanded(comment.commentID);
    } else {
      selectExcerpt({ type: EXCERPT_TYPE.COMMENTS, comment });
      setExpanded(null);
    }
  };

  return (
    <>
      <Accordion square expanded={expandedState === comment.commentID} onClick={handleClick}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <div>
            <Typography component="span">[{comment.line}]</Typography>{' '}
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
