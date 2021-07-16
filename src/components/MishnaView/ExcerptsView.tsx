import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExcerptView from "./ExcerptView";
import { excerptsMap } from "../../inc/excerptUtils";

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, .03)",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    minHeight: "3.5rem",
  },
  rootExpanded: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    overflow: "hidden",
    flexGrow: 1,
    "& >  .MuiCollapse-container": {
      height: "100% !important",
      overflow: "scroll",
    },
    "& > .MuiCollapse-container > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > div > .MuiAccordionDetails-root":
      {
        marginBottom: "5rem",
      },
  },
}));

export default function ExcerptsView(props) {
  const classes = useStyles();
  const { excerpts, expanded, type } = props;
  const [excerptBox, setExcerptBox] = useState(false);
  const rootClass = excerptBox ? classes.rootExpanded : classes.root;

  const title = excerptsMap.get(type)?.title;
  const filteredList = excerpts?.filter((excerpt) => excerpt.type === type);

  if (!excerpts || filteredList.length === 0) {
    return null;
  }

  return (
    <Accordion
      className={rootClass}
      square
      expanded={excerptBox}
      onChange={() => {
        setExcerptBox(!excerptBox);
      }}
    >
      <AccordionSummary>
        <Typography>
          {title} - {filteredList.length}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ width: "100%" }}>
          {filteredList.map((excerpt) => (
            <ExcerptView
              key={excerpt.key}
              expanded={expanded}
              excerpt={excerpt}
            />
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
