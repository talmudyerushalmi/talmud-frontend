import React from "react"
import { Container, Grid } from "@material-ui/core"
import MainText from "../components/MishnaView/MainText"
import ChooseMishnaBar from "../components/shared/ChooseMishnaBar"
import MishnaText from "../components/MishnaView/MishnaText"
import { connect } from "react-redux"
import { selectExcerpt } from "../store/actions"
import ExcerptsSection from "../components/MishnaView/ExcerptsSection"
import MishnaViewOptions from "../components/MishnaView/MishnaViewOptions"
import { useHistory, useParams } from "react-router"

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
const MishnaPage = props => {
  const { loading, currentMishna } = props
  const { mishna } = useParams();
  const history = useHistory();
  

  const onLineSelected = link => {
    if (link) {
      history.push(`/talmud/${link.tractate}/${link.chapter}/${link.mishna}`)
    }
  }

  return (
   
      <Container style={{ direction: "rtl" }}>
        <ChooseMishnaBar onNavigationSelected={onLineSelected} />
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

export default connect(mapStateToProps,mapDispatchToProps)(MishnaPage)
