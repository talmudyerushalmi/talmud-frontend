import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { connect } from "react-redux"
import { selectSubline } from "../../store/actions"
import MarkedText from "../shared/MarkedText"
import { excerptSelection } from "../../inc/excerptUtils"
import SynopsisTable from "./SynopsisTable"
import { clearPunctutationFromText, hideSourceFromText } from "../../inc/synopsisUtils"

const mapStateToProps = state => ({
  selectedSublineData: state.mishnaView.selectedSublineData,
  selectedExcerpt: state.mishnaView.selectedExcerpt,
  showPunctuation: state.mishnaView.showPunctuation,
  showSources: state.mishnaView.showSources
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectSubline: (sublineData, lineIndex) => {
    dispatch(selectSubline(sublineData, lineIndex))
  },
})

const useStyles = makeStyles(theme => {
  return {
    root: {
      "&.selected": { background: "#d1bae9" },
      "& > .MuiAccordionSummary-root": {
        minHeight: 0,
        "& > .MuiAccordionSummary-content": {
          margin: 0,
          "& > p": {
            margin: 0,
          },
        },
        "& > .MuiAccordionSummary-expandIcon": {
          padding: 0,
        },
      },
    },
    lineroot: {
      display: "flex",
    },
    table: {
      width: "100%",
      direction: "rtl",
      "& th,td": {
        textAlign: "right",
        direction: "rtl",
      },
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
      "&.piska": {
        fontWeight: "bold",
      },
    },
    expansion: {
      display: "block",
      paddingLeft: 0,
      paddingRight: 0
    },
    lineNumber: {
      ...theme.typography.lineNumber,
    },
    sourceReference: {
      ...theme.typography.sourceReference,
    },
  }
})

const SublineDisplay = props => {
  const {
    subline,
    lineIndex,
    selectedSublineData,
    selectSubline,
    selectedExcerpt,
    showPunctuation,
    showSources
  } = props
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)

  const handleSelect = subline => {
    if (subline.index === selectedSublineData?.index) {
      selectSubline(null)
    } else {
      selectSubline(subline, lineIndex)
    }
  }
  const handleExpand = panel => {
    setExpanded(expanded ? false : panel)
  }
  const piskaClass = subline?.piska ? "piska" : ""

  const handleExpandClick = e => {
    e.stopPropagation()
    handleExpand(`panelb${subline.index}`)
  }

  const selectedClass =
    subline.index === selectedSublineData?.index ? "selected" : ""
  const markedSelection = excerptSelection(subline, selectedExcerpt)

  let textToDisplay = subline.text;
  if (!showSources) {
    textToDisplay = hideSourceFromText(textToDisplay)
  }
  if (!showPunctuation) {
    textToDisplay = clearPunctutationFromText(textToDisplay);
  }

  return (
    <>
      <Accordion
        square={true}
        expanded={expanded === `panelb${subline.index}`}
        onClick={() => handleSelect(subline, lineIndex)}
        className={`${classes.root} ${selectedClass}`}
      >
        <AccordionSummary
          style={{ paddingRight: "0.25rem" }}
          expandIcon={<ExpandMoreIcon />}
          IconButtonProps={{
            onClick: handleExpandClick,
            style: { color: "#6633994f" },
          }}
          aria-controls="subline-content"
        >
          <p>
            <Typography component="span" className={classes.lineNumber}>
              {subline.index}
            </Typography>
            <MarkedText
              from={markedSelection?.from}
              to={markedSelection?.to}
              className={`${classes.heading} ${piskaClass}`}
              text={textToDisplay}
            />
          </p>
        </AccordionSummary>
        <AccordionDetails className={classes.expansion}>
          <SynopsisTable synopsis={subline?.synopsis} />
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SublineDisplay)
