import React from "react"
import { connect } from "react-redux"
import MainLines from "./MainLines"
import UndividedText from "./UndividedText"

const mapStateToProps = state => ({
  divideToLines: state.mishnaView.divideToLines,
  showPunctuation: state.mishnaView.showPunctuation,
  showSources: state.mishnaView.showSources
})

const MainText = props => {
  const { lines, divideToLines, showPunctuation, showSources } = props
  if (!lines) {
    return null
  }
  return (
    <>
      {divideToLines ? (
        <MainLines lines={lines}  />
      ) : (
        <UndividedText lines={lines} showPunctuation={showPunctuation}
        showSources={showSources} />
      )}

      {/* <SectionNosach
        nosach = {nosach}
      /> */}
    </>
  )
}

export default connect(mapStateToProps)(MainText)
