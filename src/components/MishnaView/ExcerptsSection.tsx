import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { selectExcerpt } from '../../store/actions';
import { iComment, iComments, iPublicCommentsByTractate } from '../../types/types';
import { themeConstants } from '../../ui/Theme';
import { EXCERPT_TYPE } from '../edit/EditMishna/ExcerptDialog';
import { CommentsExcerptsView } from './CommentsExcerptsView';
import ExcerptDetailsView from './ExcerptDetailsView';
import ExcerptsView from './ExcerptsView';

const mapStateToProps = (state) => ({
  currentMishna: state.navigation.currentMishna,
  filteredExcerpts: state.mishnaView.filteredExcerpts,
  selectedExcerpt: state.mishnaView.selectedExcerpt,
  detailsExcerptPopup: state.mishnaView.detailsExcerptPopup,
  expanded: state.mishnaView.expanded,
  publicComments: state.comments.publicComments,
  privateComments: state.comments.privateComments,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  selectExcerpt: (excerpt) => {
    dispatch(selectExcerpt(excerpt));
  },
});

interface IProps {
  expanded: boolean;
  filteredExcerpts: any[];
  detailsExcerptPopup: boolean;
  selectedExcerpt: any;
  selectExcerpt: (excerpt: any) => void;
  publicComments: iPublicCommentsByTractate[];
  privateComments: iComment[];
}

const ExcerptsSection = (props: IProps) => {
  const {
    expanded,
    filteredExcerpts,
    detailsExcerptPopup,
    selectedExcerpt,
    selectExcerpt,
    publicComments,
    privateComments,
  } = props;
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
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <div
      style={{
        position: 'sticky',
        top: themeConstants.fixedTopPadding,
        height: '98vh',
        display: 'flex',
        flexDirection: 'column',
      }}
      ref={wrapperRef}>
      <ExcerptDetailsView
        selectedExcerpt={selectedExcerpt}
        open={detailsExcerptPopup}
        onClose={() => {
          selectExcerpt(null);
        }}
      />
      <ExcerptsView expanded={expanded} type={EXCERPT_TYPE.MAKBILA} excerpts={filteredExcerpts} />
      <ExcerptsView type={EXCERPT_TYPE.MUVAA} expanded={expanded} excerpts={filteredExcerpts} />
      <ExcerptsView type={EXCERPT_TYPE.NOSACH} expanded={expanded} excerpts={filteredExcerpts} />
      <ExcerptsView type={EXCERPT_TYPE.BIBLIO} expanded={expanded} excerpts={filteredExcerpts} />
      <ExcerptsView type={EXCERPT_TYPE.EXPLANATORY} expanded={expanded} excerpts={filteredExcerpts} />
      <ExcerptsView type={EXCERPT_TYPE.DICTIONARY} expanded={expanded} excerpts={filteredExcerpts} />
      <CommentsExcerptsView expanded={expanded} comments={privateComments} />
      <CommentsExcerptsView expanded={expanded} comments={publicComments} isPublicComments />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ExcerptsSection);
