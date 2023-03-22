import { iComments, iPostComment, iPublicCommentsByTractate } from '../types/types';
import axiosInstance from './api';

export class CommentService {
  static async getCommentsByUser(userID: string, tractate?: string): Promise<iComments | []> {
    const url = `comments/${userID}${tractate && `/${tractate}`}`;
    const response = await axiosInstance.get(url);
    return response.data;
  }

  static async createComment(userID: string, comment: iPostComment): Promise<iComments | []> {
    const url = `comments/create/${userID}`;
    const response = await axiosInstance.post(url, comment);
    return response.data;
  }

  // static async updateComment(userID: string, comment: iPostComment): Promise<iComments | []> {
  //   const url = `comments/update/${userID}`;
  //   const response = await axiosInstance.put(url, comment);
  //   return response.data;
  // }

  static async removeComment(userID: string, commentID: string): Promise<iComments | []> {
    const url = `comments/${userID}/${commentID}`;
    const response = await axiosInstance.delete(url);
    return response.data;
  }

  static async getPublicCommentsByTractate(tractate: string): Promise<iPublicCommentsByTractate | []> {
    const url = `comments/public/${tractate}`;
    const response = await axiosInstance.get(url);
    return response.data;
  }

  static async getCommentsForModeration(): Promise<iComments | []> {
    const url = `comments/moderation`;
    const response = await axiosInstance.get(url);
    return response.data;
  }
}
