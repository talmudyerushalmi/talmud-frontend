import { Dispatch } from 'redux';
import { CommentService } from '../../services/commentsService';
import { iComments } from '../../types/types';
import { tryAsyncWithLoadingState } from './actionHelpers';

export const SET_COMMENTS = 'SET_PRIVATE_COMMENTS';

export const setPrivateComments = (comments: iComments | []) => ({
  type: SET_COMMENTS,
  comments,
});

export const getPrivateComments = (userID: string) => {
  return async function (dispatch: Dispatch) {
    const comments = await tryAsyncWithLoadingState(dispatch, CommentService.getCommentsByUser(userID));
    dispatch(setPrivateComments(comments));
  };
};
