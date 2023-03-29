import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { selectExcerpt } from '../../store/actions';
import { iComment, iMishna, iPublicCommentsByTractate } from '../../types/types';
import { themeConstants } from '../../ui/Theme';
import { EXCERPT_TYPE } from '../edit/EditMishna/ExcerptDialog';
import CommentsExcerptDetailsView from './CommentsExcerptDetailsView';
import { CommentsExcerptsView } from './CommentsExcerptsView';
import ExcerptDetailsView from './ExcerptDetailsView';
import ExcerptsView from './ExcerptsView';
import { commentInLines } from '../../inc/excerptUtils';

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
  currentMishna: iMishna;
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
    currentMishna,
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

  const [publicCommentsByMishna, setPublicCommentsByMishna] = useState<iPublicCommentsByTractate[]>([]);
  const [privateCommentsByMishna, setPrivateCommentsByMishna] = useState<iComment[]>([]);

  useEffect(() => {
    const fromLine = +currentMishna?.lines[0]?.lineNumber!;
    const toLine = +currentMishna?.lines?.at(-1)?.lineNumber!;
    const tractate = currentMishna?.tractate;

    setPrivateCommentsByMishna(privateComments?.filter((comment) => commentInLines(comment, fromLine, toLine)));
    setPublicCommentsByMishna(
      publicComments?.filter((comment) => commentInLines(comment, fromLine, toLine) && comment.tractate === tractate)
    );
  }, [currentMishna?.lines, currentMishna?.tractate, privateComments, publicComments]);

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
        selectedExcerpt={selectedExcerpt?.type !== EXCERPT_TYPE.COMMENTS ? selectedExcerpt : null}
        open={detailsExcerptPopup && selectedExcerpt?.type !== EXCERPT_TYPE.COMMENTS}
        onClose={() => {
          selectExcerpt(null);
        }}
      />
      <CommentsExcerptDetailsView
        onClose={() => selectExcerpt(null)}
        selectedComment={selectedExcerpt?.type === EXCERPT_TYPE.COMMENTS ? selectedExcerpt.comment : null}
        open={detailsExcerptPopup && selectedExcerpt?.type === EXCERPT_TYPE.COMMENTS}
      />
      <ExcerptsView expanded={expanded} type={EXCERPT_TYPE.MAKBILA} excerpts={filteredExcerpts} />
      <ExcerptsView type={EXCERPT_TYPE.MUVAA} expanded={expanded} excerpts={filteredExcerpts} />
      <ExcerptsView type={EXCERPT_TYPE.NOSACH} expanded={expanded} excerpts={filteredExcerpts} />
      <ExcerptsView type={EXCERPT_TYPE.BIBLIO} expanded={expanded} excerpts={filteredExcerpts} />
      <ExcerptsView type={EXCERPT_TYPE.EXPLANATORY} expanded={expanded} excerpts={filteredExcerpts} />
      <ExcerptsView type={EXCERPT_TYPE.DICTIONARY} expanded={expanded} excerpts={filteredExcerpts} />
      <CommentsExcerptsView expanded={expanded} comments={privateCommentsByMishna} />
      <CommentsExcerptsView expanded={expanded} comments={publicCommentsByMishna} isPublicComments />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ExcerptsSection);
