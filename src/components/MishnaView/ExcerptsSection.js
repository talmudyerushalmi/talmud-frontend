import { makeStyles } from "@material-ui/core"
import React, { useEffect, useRef } from "react"
import { connect } from "react-redux"
import { selectExcerpt } from "../../store/actions"
import { themeConstants } from "../../ui/Theme"
import ExcerptDetailsView from "./ExcerptDetailsView"
import ExcerptsView from "./ExcerptsView"

const mapStateToProps = state => ({
  currentMishna: state.general.currentMishna,
  filteredExcerpts: state.mishnaView.filteredExcerpts,
  selectedExcerpt: state.mishnaView.selectedExcerpt,
  detailsExcerptPopup: state.mishnaView.detailsExcerptPopup,
  expanded: state.mishnaView.expanded,
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  selectExcerpt: excerpt => {
    dispatch(selectExcerpt(excerpt))
  },
})


const ExcerptsSection = props => {
  const {
    expanded,
    filteredExcerpts,
    detailsExcerptPopup,
    selectedExcerpt,
    selectExcerpt,
  } = props
  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          // selectExcerpt(null)
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [ref])
  }

  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef)

  return (
    <div
      style={{
        position: "sticky",
        top: themeConstants.fixedTopPadding,
        height: "98vh",
        display: "flex",
        flexDirection: "column",
      }}
      ref={wrapperRef}
    >
      <ExcerptDetailsView
        selectedExcerpt={selectedExcerpt}
        open={detailsExcerptPopup}
        onClose={() => {
          selectExcerpt(null)
        }}
      />
      <ExcerptsView
        expanded={expanded}
        type="MAKBILA"
        excerpts={filteredExcerpts}
      />
      <ExcerptsView
        type="MUVAA"
        expanded={expanded}
        excerpts={filteredExcerpts}
      />
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ExcerptsSection)
