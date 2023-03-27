import { Accordion, AccordionDetails, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import { selectExcerpt } from '../../store/actions';
import { iComment } from '../../types/types';

interface Props {
  comment: iComment;
  expanded: boolean;
}

const CommentExcerptView = (props: Props) => {
  const { comment, expanded } = props;
  const [expandedState, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setExpanded(expanded ? comment.commentID : null);
  }, [expanded]);

  const handleClick = () => {
    if (!expandedState) {
      setExpanded(comment.commentID);
    } else {
      selectExcerpt(comment);
      setExpanded(null);
    }
  };

  return (
    <>
      <Accordion square expanded={expandedState === comment.commentID} onClick={handleClick}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <div>
            <Typography component="span">[{comment.line}]</Typography>{' '}
            <Typography component="span">{comment.text}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div dangerouslySetInnerHTML={{ __html: 'test' }}></div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
export default CommentExcerptView;
