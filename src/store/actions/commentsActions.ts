import { Dispatch } from 'redux';
import { UsersService } from '../../services/UsersService';
import { iComments, iPostComment, iUpdateComment } from '../../types/types';
import { tryAsyncWithLoadingState } from './actionHelpers';
import { iComment } from '../../types/types';

export const SET_PRIVATE_COMMENTS = 'SET_PRIVATE_COMMENTS';
export const CREATE_COMMENT = 'CREATE_COMMENT';
export const SET_COMMENT_MODAL = 'SET_COMMENT_MODAL';
export const SET_SELECTED_COMMENT = 'SET_SELECTED_COMMENT';

export const setPrivateComments = (comments: iComments | []) => ({
  type: SET_PRIVATE_COMMENTS,
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

export const getPrivateComments = () => {
  return async function (dispatch: Dispatch, getState) {
    const { tractate, chapter, mishna } = getState().navigation.currentRoute;
    const res = await tryAsyncWithLoadingState(dispatch, UsersService.getCommentsByUser(tractate, chapter, mishna));
    dispatch(setPrivateComments(res.comments));
  };
};

export const createComment = (comment: iPostComment) => {
  return async function (dispatch: Dispatch, getState) {
    const res = await tryAsyncWithLoadingState(dispatch, UsersService.createComment(comment));
    dispatch(setPrivateComments(res.comments));
  };
};

export const removeComment = (commentID: string) => {
  return async function (dispatch: Dispatch, getState) {
    const res = await tryAsyncWithLoadingState(dispatch, UsersService.removeComment(commentID));
    dispatch(setPrivateComments(res.comments));
  };
};

export const updateComment = (comment: iUpdateComment) => {
  return async function (dispatch: Dispatch, getState) {
    await tryAsyncWithLoadingState(dispatch, UsersService.updateComment(comment));
    getPrivateComments();
  };
};
