import React from "react";
import { Grid } from "@mui/material";
import MainText from "../components/MishnaView/MainText";
import MishnaText from "../components/MishnaView/MishnaText";
import { connect } from "react-redux";
import { selectExcerpt } from "../store/actions";
import ExcerptsSection from "../components/MishnaView/ExcerptsSection";
import MishnaViewOptions from "../components/MishnaView/MishnaViewOptions";
import { useParams } from "react-router";
import { getHTMLFromRawContent } from "../inc/editorUtils";
import { iMishna } from "../types/types";
import { routeObject } from "../routes/AdminRoutes";

const mapStateToProps = (state) => ({
  currentMishna: state.general.currentMishna,
  filteredExcerpts: state.mishnaView.filteredExcerpts,
  selectedExcerpt: state.mishnaView.selectedExcerpt,
  detailsExcerptPopup: state.mishnaView.detailsExcerptPopup,
  expanded: state.mishnaView.expanded,
  loading: state.general.loading,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  selectExcerpt: (excerpt) => {
    dispatch(selectExcerpt(excerpt));
  },
});

interface Props {
  currentMishna: iMishna;
}
const MishnaPage = (props: Props) => {
  const { currentMishna } = props;
  const { mishna } = useParams<routeObject>();

  return (
    <Grid container spacing={2}>
      <Grid
        item
        md={12}
        sx={{
          ml: 2,
          paddingTop:'0 !important',
          position: "sticky",
          top: "4rem",
          zIndex: 100,
          background: "white",
          boxShadow: "0rem 0rem 1rem 2px #0000005e",
        }}
      >
        <MishnaViewOptions />
      </Grid>
      <Grid item md={8}>
        <Grid container justifyContent="center" item sm={12}>
          <Grid item md={12}>
            <MishnaText
              mishna={mishna}
              html={getHTMLFromRawContent(currentMishna?.richTextMishna)}
            />
          </Grid>
        </Grid>
        <MainText lines={currentMishna?.lines} />
      </Grid>
      <Grid item md={4}>
        <ExcerptsSection />
      </Grid>
    </Grid>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MishnaPage);
