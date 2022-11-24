import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, IconButton, Typography } from '@mui/material';
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
});

const useStyles = makeStyles((theme) => ({
  root: {
    '&.selected': { background: '#f2ff7385' },
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
}
const SublineDisplay = (props: Props) => {
  const { subline, selectedSublines, selectSublines, selectedExcerpt, showPunctuation, showSources, showEditType } =
    props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState('');

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

  const selectedClass = isSelected(subline) ? 'selected' : '';

  let textToDisplay = subline.text;
  if (!showSources) {
    textToDisplay = hideSourceFromText(textToDisplay);
  }
  const markedSelection = excerptSelection(textToDisplay, subline, selectedExcerpt);

  return (
    <>
      <Accordion
        square={true}
        expanded={expanded === `panelb${subline.index}`}
        onClick={() => handleSelect(subline)}
        className={`${classes.root} ${selectedClass} ${piskaClass}`}>
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
          <SynopsisTable subline={subline} />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SublineDisplay);
