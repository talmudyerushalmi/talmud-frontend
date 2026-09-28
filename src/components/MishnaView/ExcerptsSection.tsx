import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { selectExcerpt } from '../../store/actions';
import { iComment, iExcerpt, iMishna } from '../../types/types';
import { AppDispatch, RootState } from '../../store';
import { themeConstants } from '../../ui/Theme';
import { EXCERPT_TYPE } from '../edit/EditMishna/ExcerptDialog';
import CommentsExcerptDetailsView from './CommentsExcerptDetailsView';
import { CommentsExcerptsView } from './CommentsExcerptsView';
import ExcerptDetailsView from './ExcerptDetailsView';
import ExcerptsView from './ExcerptsView';
import { CommentModal, iCommentModal, setSelectedComment } from '../../store/actions/commentsActions';
import CreateCommentModal from './CreateCommentModal';
import { UserGroup } from '../../store/reducers/authReducer';
import { useIsSticky } from '../../hooks/useIsSticky';

const mapStateToProps = (state: RootState) => ({
  currentMishna: state.navigation.currentMishna,
  filteredExcerpts: state.mishnaView.filteredExcerpts,
  selectedExcerpt: state.mishnaView.selectedExcerpt,
  detailsExcerptPopup: state.mishnaView.detailsExcerptPopup,
  expanded: state.mishnaView.expanded,
  privateComments: state.comments.privateComments,
  commentModal: state.comments.commentModal,
  selectedComment: state.comments.selectedComment,
  isAuthenticated: state.authentication.userGroup !== UserGroup.Unauthenticated,
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  selectExcerpt: (excerpt: iExcerpt | null) => {
    dispatch(selectExcerpt(excerpt));
  },
  setSelectedComment: (comment: iComment | null) => {
    dispatch(setSelectedComment(comment));
  },
});

interface IProps {
  expanded: boolean;
  filteredExcerpts: iExcerpt[];
  detailsExcerptPopup: boolean;
  // `selectedExcerpt` is only consumed while `detailsExcerptPopup === true`
  // (i.e. after a selection). Downstream `ExcerptDetailsView` also assumes
  // non-null, so we keep the same shape here.
  selectedExcerpt: iExcerpt;
  selectExcerpt: (excerpt: iExcerpt | null) => void;
  privateComments: iComment[];
  currentMishna: iMishna;
  commentModal: iCommentModal | null;
  selectedComment: iComment;
  setSelectedComment: (comment: iComment | null) => void;
  isAuthenticated: boolean;
}

const ExcerptsSection = (props: IProps) => {
  const {
    expanded,
    filteredExcerpts,
    detailsExcerptPopup,
    selectedExcerpt,
    selectExcerpt,
    privateComments,
    commentModal,
    selectedComment,
    setSelectedComment,
    isAuthenticated,
  } = props;

  function useOutsideAlerter(ref: React.RefObject<HTMLElement | null>) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
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

  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef);

  const isSticky = useIsSticky(wrapperRef, 136);
  const divHeight = isSticky ? 'calc(100vh - 170px)' : 'calc(100vh - 270px)';

  return (
    <div
      style={{
        position: 'sticky',
        top: themeConstants.fixedTopPadding,
        height: divHeight,
        transition: 'height 0.5s',
        overflowY: 'auto',
      }}
      ref={wrapperRef}
    >
      {detailsExcerptPopup ? (
        <ExcerptDetailsView
          selectedExcerpt={selectedExcerpt}
          open={detailsExcerptPopup}
          onClose={() => {
            selectExcerpt(null);
          }}
        />
      ) : (
        <>
          <ExcerptsView expanded={expanded} type={EXCERPT_TYPE.MAKBILA} excerpts={filteredExcerpts} />
          <ExcerptsView type={EXCERPT_TYPE.MUVAA} expanded={expanded} excerpts={filteredExcerpts} />
          <ExcerptsView type={EXCERPT_TYPE.NOSACH} expanded={expanded} excerpts={filteredExcerpts} />
          <ExcerptsView type={EXCERPT_TYPE.BIBLIO} expanded={expanded} excerpts={filteredExcerpts} />
          <ExcerptsView type={EXCERPT_TYPE.EXPLANATORY} expanded={expanded} excerpts={filteredExcerpts} />
          <ExcerptsView type={EXCERPT_TYPE.DICTIONARY} expanded={expanded} excerpts={filteredExcerpts} />
          {isAuthenticated && (
            <>
              <ExcerptsView type={EXCERPT_TYPE.COMMENT} expanded={expanded} excerpts={filteredExcerpts} />
              <CommentsExcerptsView expanded={expanded} comments={privateComments} />
              <CommentsExcerptDetailsView
                onClose={() => setSelectedComment(null)}
                selectedComment={selectedComment}
                open={commentModal?.open === CommentModal.EDIT}
              />
              <CreateCommentModal
                open={commentModal?.open === CommentModal.CREATE}
                onClose={() => setSelectedComment(null)}
                commentModal={commentModal}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ExcerptsSection);
