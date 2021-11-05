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
import { selectSublines } from "../../store/actions"
import MarkedText from "../shared/MarkedText"
import { excerptSelection } from "../../inc/excerptUtils"
import SynopsisTable from "./SynopsisTable"
import { clearPunctutationFromText, hideSourceFromText } from "../../inc/synopsisUtils"
import { iExcerpt, iSubline } from "../../types/types"

const mapStateToProps = state => ({
  selectedSublines: state.mishnaView.selectedSublines,
  selectedExcerpt: state.mishnaView.selectedExcerpt,
  showPunctuation: state.mishnaView.showPunctuation,
  showSources: state.mishnaView.showSources
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectSublines: (sublines) => {
    dispatch(selectSublines(sublines))
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
      //@ts-ignore //todo solve theme typings
      ...theme.typography.lineNumber,
    },
    sourceReference: {
        //@ts-ignore
      ...theme.typography.sourceReference,
    },
  }
})

interface Props {
  subline: iSubline;
  lineIndex: number;
  selectedSublines: iSubline[];
  selectSublines: Function;
  selectedExcerpt: iExcerpt;
  showPunctuation: boolean;
  showSources: boolean;
}
const SublineDisplay = (props: Props) => {
  const {
    subline,
    selectedSublines,
    selectSublines,
    selectedExcerpt,
    showPunctuation,
    showSources
  } = props
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState("")


  const isSelected = (subline: iSubline)=>{
   return selectedSublines.some(s=>s.index === subline.index)
  }
  const handleSelect = subline => {
    if (isSelected(subline)) {
      selectSublines([])
    } else {
      selectSublines([subline])
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
    isSelected(subline) ? "selected" : "";
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
        onClick={() => handleSelect(subline)}
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
