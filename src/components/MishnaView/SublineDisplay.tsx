import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useRef } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { connect } from 'react-redux';
import { selectSublines } from '../../store/actions';
import { excerptSelection } from '../../inc/excerptUtils';
import SynopsisTable from './SynopsisTable';
import { hideSourceFromText } from '../../inc/synopsisUtils';
import { iExcerpt, iSubline, DafAmudMarker } from '../../types/types';
import NosachView from './NosachView';
import { ShowEditType } from '../../store/reducers/mishnaViewReducer';
import { CommentModal, iCommentModal, setCommentModal } from '../../store/actions/commentsActions';
import { getFirstAndLastWordOfString } from '../../inc/textUtils';
import { UserGroup } from '../../store/reducers/authReducer';
import { useTranslation } from 'react-i18next';
import { hebrewToNumber, hebrewAmudToEnglish } from '../../inc/utils';

const mapStateToProps = (state) => ({
  selectedSublines: state.mishnaView.selectedSublines,
  selectedExcerpt: state.mishnaView.selectedExcerpt,
  showPunctuation: state.mishnaView.showPunctuation,
  showSources: state.mishnaView.showSources,
  showEditType: state.mishnaView.showEditType,
  userGroup: state.authentication.userGroup,
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
    '&.MuiAccordion-root': { margin: 0, marginBottom: '2px' },
    '&.MuiAccordion-root.Mui-expanded': { margin: 0, marginBottom: '2px' },
    '&.MuiAccordion-root:before': { display: 'none' },
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
  selected: {
    '&.MuiAccordion-root': {
      border: 'none !important',
      boxShadow: 'none !important',
      '&::after': {
        display: 'none !important',
      },
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
  lineDetails: {
    lineNumber: string;
    lineIndex: number;
    mainLine: string;
  };
  userGroup: UserGroup;
  dafAmudMarker?: DafAmudMarker;
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
    lineDetails,
    userGroup,
    dafAmudMarker,
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const { i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';

  // Convert Daf/Amud to English format if needed
  const formatDafAmud = (daf: string, amud: string) => {
    if (isHebrew) {
      // Hebrew RTL: Daf:Amud displays correctly as Daf on right, Amud on left
      const result = `${daf}:${amud}`;
      return result;
    } else {
      // English LTR: Daf:Amud displays as number:letter (e.g., 5:b)
      const dafNumber = hebrewToNumber(daf).toString();
      const amudLetter = hebrewAmudToEnglish(amud);
      // Use Unicode LTR mark to force left-to-right display
      const result = `\u200E${dafNumber}:${amudLetter}\u200E`;
      return result;
    }
  };

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
      lineNumber: lineDetails.lineNumber,
      fromWord: firstWord,
      toWord: lastWord,
      lineText: lineDetails.mainLine,
      lineIndex: lineDetails.lineIndex,
    });
  };

  const isSublineSelected = isSelected(subline);
  const selectedClass = isSublineSelected ? classes.selected : '';
  const accordionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = accordionRef.current?.parentElement;
    if (parent) {
      const nextSibling = parent.nextElementSibling;
      if (nextSibling) {
        if (isSublineSelected) {
          nextSibling.classList.add('after-selected');
        } else {
          nextSibling.classList.remove('after-selected');
        }
      }
    }
  }, [isSublineSelected]);

  // Auto-scroll to the first line of the selected excerpt
  useEffect(() => {
    if (
      selectedExcerpt &&
      selectedExcerpt.selection?.fromSubline === subline.index &&
      accordionRef.current
    ) {
      accordionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedExcerpt, subline.index]);

  // Auto-scroll to the line with Daf/Amud marker
  useEffect(() => {
    if (dafAmudMarker && accordionRef.current) {
      accordionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [dafAmudMarker]);

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
            left: userGroup === UserGroup.Editor ? -120 : '-3rem',
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
        ref={accordionRef}
        square={true}
        elevation={0}
        expanded={expanded === `panelb${subline.index}`}
        onClick={() => handleSelect(subline)}
        className={`${classes.root} ${selectedClass} ${piskaClass}`}
        sx={{
          ...(isSublineSelected ? theme.custom.selectionColor : null),
        }}
        onMouseEnter={() => handleMouseEnter(subline.index)}
        onMouseLeave={() => handleMouseLeave()}>
        <AccordionSummary sx={{ paddingRight: '0.25rem', position: 'relative' }} aria-controls="subline-content">
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
          {/* Daf/Amud badge positioned on the right */}
          {dafAmudMarker && (
            <Chip
              label={formatDafAmud(dafAmudMarker.daf, dafAmudMarker.amud)}
              size="small"
              sx={{
                position: 'absolute',
                left: '-18px',
                top: '50%',
                transform: 'translateY(-50%)',
                height: '18px',
                fontSize: '0.7rem',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                '& .MuiChip-label': {
                  paddingLeft: '4px',
                  paddingRight: '4px',
                },
                '@media print': {
                  display: 'none',
                },
              }}
            />
          )}
          {/* Sub-Sugia badge positioned next to Daf/Amud marker */}
          {subline.subSugiaName && (
            <Chip
              label={subline.subSugiaName}
              size="small"
              sx={{
                position: 'absolute',
                left: dafAmudMarker ? '32px' : '-18px', // Position next to Daf/Amud if both exist
                top: '50%',
                transform: 'translateY(-50%)',
                height: '18px',
                fontSize: '0.7rem',
                backgroundColor: '#e3f2fd',
                border: '1px solid #2196f3',
                color: '#1565c0',
                '& .MuiChip-label': {
                  paddingLeft: '4px',
                  paddingRight: '4px',
                },
                '@media print': {
                  display: 'none',
                },
              }}
            />
          )}
          <AccordionActions sx={{ 
            padding: 0,
            '@media print': {
              display: 'none',
            },
          }}>
            <IconButton 
              component="div"
              role="button"
              tabIndex={0}
              aria-label="Expand subline details"
              style={{ padding: 0 }} 
              size="small" 
              onClick={handleExpandClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleExpandClick(e);
                }
              }}>
              <ExpandMoreIcon />
            </IconButton>
          </AccordionActions>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: '0.1rem 1rem' }}>
          <SynopsisTable subline={subline} lineNumber={lineDetails.lineNumber} />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SublineDisplay);
