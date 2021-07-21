import React from "react";
import { Grid } from "@material-ui/core";
import MainText from "../components/MishnaView/MainText";
import MishnaText from "../components/MishnaView/MishnaText";
import { connect } from "react-redux";
import { selectExcerpt } from "../store/actions";
import ExcerptsSection from "../components/MishnaView/ExcerptsSection";
import MishnaViewOptions from "../components/MishnaView/MishnaViewOptions";
import { useParams } from "react-router";

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
const MishnaPage = (props) => {
  const { loading, currentMishna } = props;
  const { mishna } = useParams();

  return (
    <Grid container spacing={2}>
      <Grid item>
        <MishnaViewOptions />
      </Grid>
      <Grid container justify="center" item sm={12}>
        <Grid item>
          <MishnaText mishna={mishna} html={currentMishna?.mishna_text} />
        </Grid>
      </Grid>
      <Grid item md={8}>
        <MainText
          sections={currentMishna?.sections}
          lines={currentMishna?.lines}
        />
      </Grid>
      <Grid item md={4}>
        <ExcerptsSection />
      </Grid>
    </Grid>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MishnaPage);
