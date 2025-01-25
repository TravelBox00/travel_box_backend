import {
  insertComment,
  updateComment,
  deleteComment,
  checkCommentExists,
} from './comment.model.ts';

// 댓글 추가
// eslint-disable-next-line import/prefer-default-export
export const addComment = async (commentData: {
  userId: number;
  threadId: number;
  commentContent: string;
  commentVisible: 'public' | 'private';
}) => {
  try {
    const commentId = await insertComment(commentData);

    return commentId;
  } catch (error) {
    console.error('Error in addComment service:', error);
    return false;
  }
};

// 댓글 수정
export const editComment = async (commentData: {
  commentId: number;
  commentContent: string;
  commentVisible: 'public' | 'private';
}) => {
  const { commentId } = commentData;

  const exists = await checkCommentExists(commentId);
  if (!exists) {
    throw new Error('댓글이 존재하지 않습니다.');
  }

  try {
    return await updateComment(commentData);
  } catch (error) {
    console.error('Error in editComment service:', error);
    throw error;
  }
};

// 댓글 삭제
export const removeComment = async (commentId: number) => {
  const exists = await checkCommentExists(commentId);
  if (!exists) {
    throw new Error('댓글이 존재하지 않습니다.');
  }

  try {
    return await deleteComment(commentId);
  } catch (error) {
    console.error('Error in removeComment service:', error);
    throw error;
  }
};
