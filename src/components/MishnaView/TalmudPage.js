import React from "react"
import { Container, Grid } from "@material-ui/core"
import MainText from "./MainText"
//import ChooseMishnaBar from "../shared/ChooseMishnaBar"
import MishnaText from "./MishnaText"
import { connect } from "react-redux"
import { selectExcerpt } from "../../store/actions"
import ExcerptsSection from "./ExcerptsSection"
import MishnaViewOptions from "./MishnaViewOptions"

const mapStateToProps = state => ({
  currentMishna: state.general.currentMishna,
  filteredExcerpts: state.mishnaView.filteredExcerpts,
  selectedExcerpt: state.mishnaView.selectedExcerpt,
  detailsExcerptPopup: state.mishnaView.detailsExcerptPopup,
  expanded: state.mishnaView.expanded,
  loading: state.general.loading,
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  selectExcerpt: (excerpt) => {
    dispatch(selectExcerpt(excerpt))
  },
})
const TalmudPage = props => {
  const { mishna, loading, currentMishna } = props


  // const onLineSelected = link => {
  //   if (link) {
  //     navigate(`/talmud/${link.tractate}/${link.chapter}/${link.mishna}`)
  //   }
  // }

  return (
   
      <Container style={{ direction: "rtl" }}>
        <Grid container spacing={2}>
          <MishnaViewOptions/>
          <Grid container justify="center" item sm={12}>
            <Grid item>
              <MishnaText mishna={mishna} html={currentMishna?.mishna_text} />
            </Grid>
          </Grid>
          <Grid item md={8}>
            <MainText sections={currentMishna?.sections} lines={currentMishna?.lines} />
          </Grid>
          <Grid  item md={4}>
            <ExcerptsSection/>
          </Grid>
        </Grid>
      </Container>
  
  )
}

export default connect(mapStateToProps,mapDispatchToProps)(TalmudPage)
