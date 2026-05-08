import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useMemo, useRef } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { connect } from 'react-redux';
import { selectSublines } from '../../store/actions';
import { setTaggedSubline } from '../../store/actions/mishnaViewActions';
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
import { TaggingSubline, ALL_RABBIES, TAGGING_CATEGORIES, computeContinuationBundles, CONTINUATION_CATEGORY_ID } from '../../services/tagging.service';

const mapStateToProps = (state) => ({
  selectedSublines: state.mishnaView.selectedSublines,
  selectedExcerpt: state.mishnaView.selectedExcerpt,
  showPunctuation: state.mishnaView.showPunctuation,
  showSources: state.mishnaView.showSources,
  showEditType: state.mishnaView.showEditType,
  userGroup: state.authentication.userGroup,
  taggingData: state.mishnaView.taggingData,
  selectedRabbis: state.mishnaView.selectedRabbis,
  selectedCategories: state.mishnaView.selectedCategories,
  selectedTaggedSubline: state.mishnaView.selectedTaggedSubline,
  taggedDetailedView: state.mishnaView.taggedDetailedView,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectSublines: (sublines) => {
    dispatch(selectSublines(sublines));
  },
  setCommentModal: (commentModal) => {
    dispatch(setCommentModal(commentModal));
  },
  dispatchSetTaggedSubline: (sublineIndex: number | null) => {
    dispatch(setTaggedSubline(sublineIndex));
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
  taggingData: TaggingSubline[];
  selectedRabbis: string[];
  selectedCategories: string[];
  selectedTaggedSubline: number | null;
  taggedDetailedView: boolean;
  dispatchSetTaggedSubline: (sublineIndex: number | null) => void;
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
    taggingData,
    selectedRabbis,
    selectedCategories,
    selectedTaggedSubline,
    taggedDetailedView,
    dispatchSetTaggedSubline,
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

  const isTagged = showEditType === ShowEditType.TAGGED;

  const sublineTagData = useMemo(() => {
    if (!isTagged) return null;
    return taggingData.find(t => t.index === subline.index) || null;
  }, [isTagged, taggingData, subline.index]);

  const hasCategoryHighlight = useMemo(() => {
    if (!isTagged || selectedCategories.length === 0 || !sublineTagData) return false;
    return sublineTagData.categories.some(cat => selectedCategories.includes(cat.categoryId));
  }, [isTagged, selectedCategories, sublineTagData]);

  const continuationBundles = useMemo(() => {
    if (!isTagged) return null;
    return computeContinuationBundles(taggingData);
  }, [isTagged, taggingData]);
  const myBundle = continuationBundles?.get(subline.index) || null;

  const isTaggedSublineActive = isTagged && (
    selectedTaggedSubline === subline.index ||
    (myBundle != null && selectedTaggedSubline === myBundle.sourceIndex)
  );

  const handleTaggedClick = (e) => {
    e.stopPropagation();
    const targetIndex = myBundle ? myBundle.sourceIndex : subline.index;
    if (selectedTaggedSubline === targetIndex) {
      dispatchSetTaggedSubline(null);
    } else {
      dispatchSetTaggedSubline(targetIndex);
    }
  };

  let textToDisplay = subline.text;
  if (!showSources) {
    textToDisplay = hideSourceFromText(textToDisplay);
  }
  const markedSelection = excerptSelection(textToDisplay, subline, selectedExcerpt);
  return (
    <>
      {!isTagged && (hoverSubline === subline.index || commentButtonHover) && (
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
        </Button>
      )}
      <Accordion
        ref={accordionRef}
        square={true}
        elevation={0}
        expanded={!isTagged && expanded === `panelb${subline.index}`}
        onClick={isTagged ? handleTaggedClick : () => handleSelect(subline)}
        className={`${classes.root} ${selectedClass} ${piskaClass}`}
        sx={{
          ...(isSublineSelected && !isTagged ? theme.custom.selectionColor : null),
          ...(hasCategoryHighlight ? { backgroundColor: '#f3e5f5' } : null),
          ...(myBundle && !isTaggedSublineActive ? { backgroundColor: `${myBundle.sourceColor}1a` } : null),
          ...(isTaggedSublineActive ? { backgroundColor: '#e3f2fd', border: '1px solid #90caf9' } : null),
          cursor: isTagged ? 'pointer' : undefined,
        }}
        onMouseEnter={() => handleMouseEnter(subline.index)}
        onMouseLeave={() => handleMouseLeave()}>
        <AccordionSummary sx={{ paddingRight: '0.25rem', position: 'relative' }} aria-controls="subline-content">
          <Typography variant="lineNumber" component="span">
            {subline.index}
          </Typography>
          <NosachView
            showPunctuation={showPunctuation}
            showEditType={isTagged ? ShowEditType.COMBINED : showEditType}
            selectedExcerpt={isTagged ? undefined : selectedExcerpt}
            markFrom={isTagged ? undefined : markedSelection?.from}
            markTo={isTagged ? undefined : markedSelection?.to}
            subline={subline}
            rabbiMentions={isTagged && sublineTagData ? sublineTagData.rabbiMentions.map(m => {
              const rd = ALL_RABBIES.find(r => r.id === m.rabbiId);
              return { startIndex: m.startIndex, endIndex: m.endIndex, rabbiId: m.rabbiId, generation: rd?.generation || null, isBavel: rd?.location === 'בבל', isEretzIsrael: rd?.location === 'ארץ ישראל', doubt: m.doubt };
            }) : undefined}
            selectedRabbiIds={isTagged ? selectedRabbis : undefined}
          />
          {isTagged && taggedDetailedView && sublineTagData && sublineTagData.categories.length > 0 &&
            sublineTagData.categories.map((cat) => {
              const catDef = TAGGING_CATEGORIES.find(c => c.id === cat.categoryId);
              if (!catDef) return null;
              const isBundleSourceChip = !!myBundle && subline.index === myBundle.sourceIndex && cat.categoryId === myBundle.sourceCategoryId;
              if (myBundle) {
                const isSource = subline.index === myBundle.sourceIndex;
                if (!isSource && cat.categoryId === CONTINUATION_CATEGORY_ID && (!cat.connections || cat.connections.length === 0)) return null;
              }
              return (
                <Chip
                  key={cat.categoryId}
                  size="small"
                  label={isHebrew ? catDef.label : catDef.labelEn}
                  data-bundle-source={isBundleSourceChip ? 'true' : undefined}
                  sx={{
                    fontSize: '0.6rem',
                    height: 18,
                    ml: 0.5,
                    backgroundColor: catDef.color + '22',
                    color: catDef.color,
                    border: `1px solid ${catDef.color}`,
                    fontWeight: 'bold',
                    flexShrink: 0,
                    ...(isBundleSourceChip ? {
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderBottom: 'none',
                    } : null),
                  }}
                />
              );
            })
          }
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
                left: dafAmudMarker ? '-60px' : '-18px', // Move further left when marker exists
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
          {!isTagged && (
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
          )}
        </AccordionSummary>
        {isTagged && sublineTagData && sublineTagData.rabbiMentions.length > 0 && (
          <Box sx={{ px: 3, pb: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5, direction: 'rtl' }}>
            {sublineTagData.rabbiMentions.map((mention, i) => {
              const rabbiData = ALL_RABBIES.find(r => r.id === mention.rabbiId);
              const isHighlighted = selectedRabbis.includes(mention.rabbiId);
              const genStr = rabbiData?.generation || '';
              const locationChar = rabbiData?.location === 'בבל' ? 'בבל' : rabbiData?.location === 'ארץ ישראל' ? 'א״י' : '';
              return (
                <Chip
                  key={i}
                  size="small"
                  label={
                    <span>
                      {mention.rabbiName}
                      {(genStr || locationChar) && <sub style={{ fontSize: '0.7em', marginRight: '2px' }}>{genStr}{locationChar}</sub>}
                      {mention.doubt && ' ?'}
                    </span>
                  }
                  sx={{
                    fontSize: '0.7rem',
                    height: 20,
                    backgroundColor: isHighlighted ? '#c8e6c9' : '#e8f5e9',
                    fontWeight: isHighlighted ? 'bold' : 'normal',
                    color: '#2e7d32',
                    transition: 'background-color 0.2s',
                  }}
                />
              );
            })}
          </Box>
        )}
        {!isTagged && (
          <AccordionDetails sx={{ padding: '0.1rem 1rem' }}>
            <SynopsisTable subline={subline} lineNumber={lineDetails.lineNumber} />
          </AccordionDetails>
        )}
      </Accordion>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SublineDisplay);
