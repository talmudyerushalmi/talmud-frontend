import { iComment, iUser, iPostComment, iUpdateComment } from '../types/types';
import axiosInstance from './api';

const baseURL = 'users';
const commentsURL = `${baseURL}/comments`;

export class UsersService {
  static async getCommentsByUser(tractate: string, chapter: string, mishna: string): Promise<iUser> {
    const url = `${commentsURL}/${tractate}/${chapter}/${mishna}`;
    const response = await axiosInstance.get(url);
    return response.data;
  }

  static async createComment(comment: iPostComment): Promise<iUser> {
    const url = `${commentsURL}`;
    const response = await axiosInstance.post(url, comment);
    return response.data;
  }

  static async updateComment(comment: iUpdateComment): Promise<iUser> {
    const url = `${commentsURL}`;
    const response = await axiosInstance.patch(url, comment);
    return response.data;
  }

  static async removeComment(commentID: string): Promise<iUser> {
    const url = `${commentsURL}/${commentID}`;
    const response = await axiosInstance.delete(url);
    return response.data;
  }

  static async getCommentsForModeration(): Promise<iComment[]> {
    const url = `${commentsURL}/moderation`;
    const response = await axiosInstance.get(url);
    return response.data;
  }

  static async approveComment(userID: string, commentID: string): Promise<iUser> {
    const url = `${commentsURL}/moderation/${userID}/${commentID}`;
    const response = await axiosInstance.post(url);
    return response.data;
  }

  static async rejectComment(userID: string, commentID: string): Promise<iUser> {
    const url = `${commentsURL}/moderation/${userID}/${commentID}`;
    const response = await axiosInstance.delete(url);
    return response.data;
  }
}
