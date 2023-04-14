import { Dispatch } from 'redux';
import { CommentService } from '../../services/commentsService';
import { iComments, iPostComment, iUpdateComment } from '../../types/types';
import { tryAsyncWithLoadingState } from './actionHelpers';
import { iComment } from '../../types/types';

export const SET_PRIVATE_COMMENTS = 'SET_PRIVATE_COMMENTS';
export const SET_PUBLIC_COMMENTS = 'SET_PUBLIC_COMMENTS';
export const CREATE_COMMENT = 'CREATE_COMMENT';
export const SET_COMMENT_MODAL = 'SET_COMMENT_MODAL';
export const SET_SELECTED_COMMENT = 'SET_SELECTED_COMMENT';

export const setPrivateComments = (comments: iComments | []) => ({
  type: SET_PRIVATE_COMMENTS,
  comments,
});

export const setPublicComments = (comments: iComments | []) => ({
  type: SET_PUBLIC_COMMENTS,
  comments,
});

export const setCommentModal = (open: boolean) => ({
  type: SET_COMMENT_MODAL,
  open,
});

export const setSelectedComment = (comment: iComment | null) => ({
  type: SET_SELECTED_COMMENT,
  comment,
});

export const getComments = (tractate: string) => {
  return async function (dispatch) {
    dispatch(getPrivateComments());
    dispatch(getPublicComments(tractate || 'yebamot'));
  };
};

export const getPrivateComments = () => {
  return async function (dispatch: Dispatch, getState) {
    const username = getState().authentication?.userAuth?.username;
    const res = await tryAsyncWithLoadingState(dispatch, CommentService.getCommentsByUser(username || '12'));
    dispatch(setPrivateComments(res.comments));
  };
};

export const getPublicComments = (tractate: string) => {
  return async function (dispatch: Dispatch) {
    const res = await tryAsyncWithLoadingState(dispatch, CommentService.getPublicCommentsByTractate(tractate));
    dispatch(setPublicComments(res));
  };
};

export const createComment = (comment: iPostComment) => {
  return async function (dispatch: Dispatch, getState) {
    const username = getState().authentication?.userAuth?.username;
    const res = await tryAsyncWithLoadingState(dispatch, CommentService.createComment(username, comment));
    dispatch(setPrivateComments(res.comments));
  };
};

export const removeComment = (commentID: string) => {
  return async function (dispatch: Dispatch, getState) {
    const username = getState().authentication?.userAuth?.username;
    const res = await tryAsyncWithLoadingState(dispatch, CommentService.removeComment(username, commentID));
    dispatch(setPrivateComments(res.comments));
    getPublicComments(getState().navigation.currentTractate);
  };
};

export const updateComment = (comment: iUpdateComment) => {
  return async function (dispatch: Dispatch, getState) {
    const state = getState();
    // const username = state.authentication?.userAuth?.username;
    await tryAsyncWithLoadingState(dispatch, CommentService.updateComment('12', comment));
    dispatch(getComments(state.navigation?.currentTractate || 'yevamot') as any);
  };
};
