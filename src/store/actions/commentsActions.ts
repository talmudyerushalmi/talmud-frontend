import { Dispatch } from 'redux';
import { UsersService } from '../../services/UsersService';
import { iPostComment, iUpdateComment } from '../../types/types';
import { tryAsyncWithLoadingState } from './actionHelpers';
import { iComment } from '../../types/types';

export const SET_PRIVATE_COMMENTS = 'SET_PRIVATE_COMMENTS';
export const CREATE_COMMENT = 'CREATE_COMMENT';
export const SET_COMMENT_MODAL = 'SET_COMMENT_MODAL';
export const SET_SELECTED_COMMENT = 'SET_SELECTED_COMMENT';
export const SET_COMMENTS_FOR_MODERATION = 'SET_COMMENTS_FOR_MODERATION';

export const setPrivateComments = (comments: iComment[]) => ({
  type: SET_PRIVATE_COMMENTS,
  comments,
});

export enum CommentModal {
  EDIT = 'edit',
  CREATE = 'create',
}

export interface iCommentModal {
  open?: CommentModal;
  lineNumber?: string;
  lineText?: string;
  fromWord?: string;
  toWord?: string;
  lineIndex?: number;
}

export const setCommentModal = (payload: iCommentModal | null) => ({
  type: SET_COMMENT_MODAL,
  payload,
});

export const setSelectedComment = (comment: iComment | null) => ({
  type: SET_SELECTED_COMMENT,
  comment,
});

export const setCommentsForModeration = (comments: iComment[]) => ({
  type: SET_COMMENTS_FOR_MODERATION,
  comments,
});

export const getPrivateComments = () => {
  return async function (dispatch: Dispatch, getState) {
    const { tractate, chapter, mishna } = getState().navigation.currentRoute;
    const res = await tryAsyncWithLoadingState(dispatch, UsersService.getCommentsByUser(tractate, chapter, mishna));
    dispatch(setPrivateComments(res.comments));
  };
};

type iCreateComment = Omit<iPostComment, 'tractate' | 'chapter' | 'mishna' | 'fromSubline' | 'toSubline'>;

export const createComment = (comment: iCreateComment) => {
  return async function (dispatch: Dispatch, getState) {
    const { tractate, chapter, mishna } = getState().navigation.currentRoute;
    await tryAsyncWithLoadingState(
      dispatch,
      UsersService.createComment({
        ...comment,
        tractate,
        chapter,
        mishna,
      })
    );
    dispatch(getPrivateComments() as any);
  };
};

export const removeComment = (commentID: string) => {
  return async function (dispatch: Dispatch, getState) {
    await tryAsyncWithLoadingState(dispatch, UsersService.removeComment(commentID));
    dispatch(getPrivateComments() as any);
  };
};

export const updateComment = (comment: iUpdateComment) => {
  return async function (dispatch: Dispatch, getState) {
    await tryAsyncWithLoadingState(dispatch, UsersService.updateComment(comment));
    dispatch(getPrivateComments() as any);
  };
};

export const getCommentsForModeration = () => {
  return async function (dispatch: Dispatch, getState) {
    const res = await tryAsyncWithLoadingState(dispatch, UsersService.getCommentsForModeration());
    dispatch(setCommentsForModeration(res));
  };
};

export const approveComment = (userID: string, commentID: string) => {
  return async function (dispatch: Dispatch, getState) {
    await tryAsyncWithLoadingState(dispatch, UsersService.approveComment(userID, commentID));
    dispatch(getCommentsForModeration() as any);
  };
};

export const rejectComment = (userID: string, commentID: string) => {
  return async function (dispatch: Dispatch, getState) {
    await tryAsyncWithLoadingState(dispatch, UsersService.rejectComment(userID, commentID));
    dispatch(getCommentsForModeration() as any);
  };
};
