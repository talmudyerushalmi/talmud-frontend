import { Accordion, AccordionDetails, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import { connect } from 'react-redux';
import { selectExcerpt } from '../../store/actions';
import LinkIcon from '@mui/icons-material/Link';
import { getExcerpt } from '../../inc/editorUtils';
import { getSelectionRange } from '../../inc/excerptUtils';
import { iExcerpt } from '../../types/types';

const mapStateToProps = (state) => ({
  selectedSublineData: state.mishnaView.selectedSublineData,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectExcerpt: (sublineData) => {
    dispatch(selectExcerpt(sublineData));
  },
});



interface Props {
  excerpt: iExcerpt;
  expanded: boolean;
  selectExcerpt: Function;
}
const ExcerptView = (props: Props) => {
  const { excerpt, expanded, selectExcerpt } = props;
  const [expandedState, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    setExpanded(expanded ? excerpt.key : null);
  }, [expanded,setExpanded]);

  const handleClick = () => {
    if (!expandedState) {
      setExpanded(excerpt.key);
    } else {
      selectExcerpt(excerpt);
      setExpanded(null);
    }
  };

  let short = excerpt.short ? excerpt.short : getExcerpt(excerpt.editorStateFullQuote, 20);

  const selectionRange = getSelectionRange(excerpt);

  return (
    <>
      <Accordion square expanded={expandedState === excerpt.key} onClick={handleClick}>
        <AccordionSummary
          className={excerpt.link ? 'linked-excerpt' : ''}
          aria-controls="panel1d-content"
          id="panel1d-header"
        >
          {excerpt.link ? (
            <IconButton
              sx={{
                position: 'absolute',
                right: '0.5rem',
              }}
              onClick={(e) => {
                e.stopPropagation();
                window.open(excerpt.link, '_blank')?.focus();
              }}
              size="small"
            >
              <LinkIcon />
            </IconButton>
          ) : null}
          <div>
            <Typography component="span">[{selectionRange}] </Typography>
            <Typography style={{ fontWeight: 'bold' }} component="span">
              {excerpt.source?.title}{' '}
            </Typography>
            <Typography component="span">{excerpt.sourceLocation}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div dangerouslySetInnerHTML={{ __html: short }}></div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(ExcerptView);
