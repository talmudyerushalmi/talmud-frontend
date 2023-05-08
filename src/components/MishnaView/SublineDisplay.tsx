import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { connect } from 'react-redux';
import { selectSublines } from '../../store/actions';
import { excerptSelection } from '../../inc/excerptUtils';
import SynopsisTable from './SynopsisTable';
import { hideSourceFromText } from '../../inc/synopsisUtils';
import { iExcerpt, iSubline } from '../../types/types';
import NosachView from './NosachView';
import { ShowEditType } from '../../store/reducers/mishnaViewReducer';
import { CommentModal, iCommentModal, setCommentModal } from '../../store/actions/commentsActions';
import { getFirstAndLastWordOfString } from '../../inc/textUtils';

const mapStateToProps = (state) => ({
  selectedSublines: state.mishnaView.selectedSublines,
  selectedExcerpt: state.mishnaView.selectedExcerpt,
  showPunctuation: state.mishnaView.showPunctuation,
  showSources: state.mishnaView.showSources,
  showEditType: state.mishnaView.showEditType,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectSublines: (sublines) => {
    dispatch(selectSublines(sublines));
  },
  setCommentModal: (commentModal) => {
    dispatch(setCommentModal(commentModal));
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    '&.MuiAccordion-root.Mui-expanded': { margin: 0 },
    '& p': { margin: 0 },
    '& .MuiAccordionSummary-root, & .MuiAccordionSummary-root.Mui-expanded': { minHeight: 0 },
    '& .MuiAccordionSummary.Mui-expanded': { background: 'yellow', minHeight: 0 },
    '& .MuiAccordionSummary-content.Mui-expanded': {
      margin: 0,
    },
    '& .MuiAccordionSummary-content': {
      margin: 0,
      justifyContent: 'space-between',
    },
  },
  lineroot: {
    display: 'flex',
  },
  table: {
    width: '100%',
    direction: 'rtl',
    '& th,td': {
      textAlign: 'right',
      direction: 'rtl',
    },
  },
}));

interface Props {
  subline: iSubline;
  lineIndex: number;
  selectedSublines: iSubline[];
  selectSublines: Function;
  selectedExcerpt: iExcerpt;
  showPunctuation: boolean;
  showSources: boolean;
  showEditType: ShowEditType;
  hoverSubline: number;
  handleMouseEnter: (subline: number) => void;
  handleMouseLeave: Function;
  setCommentModal: (setCommentModal: iCommentModal | null) => void;
}
const SublineDisplay = (props: Props) => {
  const {
    subline,
    selectedSublines,
    selectSublines,
    selectedExcerpt,
    showPunctuation,
    showSources,
    showEditType,
    hoverSubline,
    handleMouseEnter,
    handleMouseLeave,
    setCommentModal,
    lineIndex,
  } = props;
  const classes = useStyles();
  const theme = useTheme();

  const [expanded, setExpanded] = React.useState('');
  const [commentButtonHover, setCommentButtonHover] = React.useState(false);

  const isSelected = (subline: iSubline) => {
    return selectedSublines.some((s) => s.index === subline.index);
  };
  const handleSelect = (subline) => {
    if (isSelected(subline)) {
      selectSublines([]);
    } else {
      selectSublines([subline]);
    }
  };
  const handleExpand = (panel) => {
    setExpanded(expanded ? false : panel);
  };
  const piskaClass = subline?.piska ? 'piska' : '';

  const handleExpandClick = (e) => {
    e.stopPropagation();
    handleExpand(`panelb${subline.index}`);
  };

  const handleCreateCommentClick = (e) => {
    const [firstWord, lastWord] = getFirstAndLastWordOfString(subline.text);
    setCommentModal({
      open: CommentModal.CREATE,
      line: lineIndex,
      subline: subline.index,
      fromWord: firstWord,
      toWord: lastWord,
      sublineText: subline.text,
    });
  };

  const isSublineSelected = isSelected(subline);
  const selectedClass = isSublineSelected ? 'selected' : '';

  let textToDisplay = subline.text;
  if (!showSources) {
    textToDisplay = hideSourceFromText(textToDisplay);
  }
  const markedSelection = excerptSelection(textToDisplay, subline, selectedExcerpt);

  return (
    <>
      {(hoverSubline === subline.index || commentButtonHover) && (
        <Button
          size="small"
          sx={{
            position: 'absolute',
            left: -80,
            zIndex: 100,
            padding: 0,
          }}
          onMouseEnter={() => setCommentButtonHover(true)}
          onMouseLeave={() => setCommentButtonHover(false)}
          onClick={handleCreateCommentClick}>
          הוסף הערה
          {/* or <AddCommentIcon /> */}
        </Button>
      )}
      <Accordion
        square={true}
        expanded={expanded === `panelb${subline.index}`}
        onClick={() => handleSelect(subline)}
        className={`${classes.root} ${selectedClass} ${piskaClass}`}
        sx={{
          ...(isSublineSelected ? theme.custom.selectionColor : null),
        }}
        onMouseEnter={() => handleMouseEnter(subline.index)}
        onMouseLeave={() => handleMouseLeave()}>
        <AccordionSummary sx={{ paddingRight: '0.25rem' }} aria-controls="subline-content">
          <Typography variant="lineNumber" component="span">
            {subline.index}
          </Typography>
          <NosachView
            showPunctuation={showPunctuation}
            showEditType={showEditType}
            selectedExcerpt={selectedExcerpt}
            markFrom={markedSelection?.from}
            markTo={markedSelection?.to}
            subline={subline}
          />
          <AccordionActions sx={{ padding: 0 }}>
            <IconButton style={{ padding: 0 }} size="small" onClick={handleExpandClick}>
              <ExpandMoreIcon />
            </IconButton>
          </AccordionActions>
        </AccordionSummary>
        <AccordionDetails>
          <SynopsisTable synopsis={subline?.synopsis} />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SublineDisplay);
