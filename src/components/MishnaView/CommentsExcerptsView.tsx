import React, { FC } from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { ExcerptsAccordion } from './exercptsAccordion';
import { iComment } from '../../types/types';
import CommentExcerptView from './CommentExcerptView';

interface IProps {
  comments: iComment[];
  expanded: boolean;
}

export const CommentsExcerptsView: FC<IProps> = ({ comments, expanded }) => {
  const { t } = useTranslation();

  const title = 'Personal Comments';

  return (
    <ExcerptsAccordion>
      <AccordionSummary>
        <Typography>
          {t(title)} - {comments?.length}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ width: '100%' }}>
          {comments?.map((comment) => (
            <CommentExcerptView comment={comment} expanded={expanded} key={comment.commentID} />
          ))}
        </div>
      </AccordionDetails>
    </ExcerptsAccordion>
  );
};

export default CommentsExcerptsView;
