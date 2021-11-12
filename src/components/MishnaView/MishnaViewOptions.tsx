import React from "react"
import { withStyles } from "@material-ui/core/styles"
import { green } from "@material-ui/core/colors"
import FormGroup from "@material-ui/core/FormGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
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
        label="Division to Lines"
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
        label="Punctuation"
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
        label="References"
      />
    </FormGroup>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MishnaViewOptions)
