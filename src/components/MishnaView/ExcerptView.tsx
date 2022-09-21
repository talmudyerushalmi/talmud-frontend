import {
  Accordion,
  AccordionDetails,
  IconButton,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React, { useEffect, useState } from "react";
import AccordionSummary from "@mui/material/AccordionSummary";
import draftToHtml from "draftjs-to-html";
import { connect } from "react-redux";
import { selectExcerpt } from "../../store/actions";
import LinkIcon from "@mui/icons-material/Link";
import { getExcerpt, isContentEmpty } from "../../inc/editorUtils";
import { getSelectionRange } from "../../inc/excerptUtils";
import { iExcerpt } from "../../types/types";

const mapStateToProps = (state) => ({
  selectedSublineData: state.mishnaView.selectedSublineData,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectExcerpt: (sublineData) => {
    dispatch(selectExcerpt(sublineData));
  },
});

const useStyles = makeStyles((theme) => ({
  sourceReference: {
    ...theme.typography.sourceReference,
  },
}));

interface Props {
  excerpt: iExcerpt;
  expanded: boolean;
  selectExcerpt: Function;
}
const ExcerptView = (props: Props) => {
  const classes = useStyles();
  const { excerpt, expanded, selectExcerpt } = props;
  const key = excerpt.key;
  const [expandedState, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    setExpanded(expanded ? excerpt.key : null);
  }, [expanded]);


  const handleClick = ()=>{
    if (!expandedState) {
      if (excerpt.short) {
        setExpanded(excerpt.key)
      } else {
        selectExcerpt(excerpt)
      }
    } else {
      selectExcerpt(excerpt)
      setExpanded(null)
    }
  }



  const selectionRange = getSelectionRange(excerpt);

  return (
    <>
      <Accordion
        square
        expanded={expandedState === excerpt.key}
        onClick={handleClick}
      >
        <AccordionSummary
          className={excerpt.link ? "linked-excerpt" : ""}
          aria-controls="panel1d-content"
          id="panel1d-header"
        >
          {excerpt.link ? (
            <IconButton
            sx={{
              position:'absolute',
              right: '0.5rem'
            }}
              onClick={(e) => {
                e.stopPropagation();
                window.open(excerpt.link, "_blank")?.focus();
              }}
              size="small"
            >
              <LinkIcon />
            </IconButton>
          ) : null}
          <div>
            <Typography component="span">[{selectionRange}] </Typography>
            <Typography style={{ fontWeight: "bold" }} component="span">
              {excerpt.source?.title}{" "}
            </Typography>
            <Typography component="span">{excerpt.sourceLocation}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
        <Typography component="div">{excerpt.short}</Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(ExcerptView);
