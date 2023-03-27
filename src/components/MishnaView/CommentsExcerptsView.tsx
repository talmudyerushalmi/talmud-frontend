import React, { FC } from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { ExcerptsAccordion } from './exercptsAccordion';
import { iComment, iPublicCommentsByTractate } from '../../types/types';
import CommentExcerptView from './CommentExcerptView';

interface IProps {
  comments: iComment[] | iPublicCommentsByTractate[];
  expanded: boolean;
  isPublicComments?: boolean;
}

export const CommentsExcerptsView: FC<IProps> = ({ comments, expanded, isPublicComments }) => {
  const { t } = useTranslation();

  const title = isPublicComments ? 'Public Comments' : 'Personal Comments';

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
            <CommentExcerptView comment={comment} expanded={expanded} />
          ))}
        </div>
      </AccordionDetails>
    </ExcerptsAccordion>
  );
};

export default CommentsExcerptsView;
