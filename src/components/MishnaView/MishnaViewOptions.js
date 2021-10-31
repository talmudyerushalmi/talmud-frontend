import React from "react"
import withStyles from '@mui/styles/withStyles';
import { green } from "@mui/material/colors"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import { connect } from "react-redux"
import { toggleShowPunctuation } from "../../store/actions"
import {
  toggleDivideToLines,
  toggleShowSources,
} from "../../store/actions/mishnaViewActions"

const mapStateToProps = state => ({
  divideToLines: state.mishnaView.divideToLines,
  showPunctuation: state.mishnaView.showPunctuation,
  showSources: state.mishnaView.showSources,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleShowPunctuation: () => {
    dispatch(toggleShowPunctuation())
  },
  toggleDivideToLines: () => {
    dispatch(toggleDivideToLines())
  },
  toggleShowSources: () => {
    dispatch(toggleShowSources())
  },
})

const MishnaViewOptions = props => {
  const {
    divideToLines,
    showPunctuation,
    toggleShowPunctuation,
    toggleDivideToLines,
    showSources,
    toggleShowSources,
  } = props

  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            checked={divideToLines}
            onChange={toggleDivideToLines}
            name="checkedB"
            color="primary"
          />
        }
        label="חלוקה לשורות"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={showPunctuation}
            onChange={toggleShowPunctuation}
            name="checkedA"
            color="primary"
          />
        }
        label="סימני פיסוק"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={showSources}
            onChange={toggleShowSources}
            name="hideSources"
            color="primary"
          />
        }
        label="מראי מקום"
      />
    </FormGroup>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MishnaViewOptions)
