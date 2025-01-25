import { RequestHandler } from 'express';
import {
  addComment,
  editComment,
  removeComment,
  fetchMyComments,
  fetchCommentsByThread,
} from './comment.service.ts';

// 댓글 추가
export const addCommentController: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { userId, threadId, commentContent, commentVisible } = req.body;

    if (!userId || !threadId || !commentContent || !commentVisible) {
      res
        .status(400)
        .json({ isSuccess: false, message: 'Missing required fields' });
      return;
    }

    const commentId = await addComment({
      userId,
      threadId,
      commentContent,
      commentVisible,
    });

    if (commentId) {
      res.status(201).json({ isSuccess: true, result: { commentId } });
    } else {
      res.status(500).json({ isSuccess: false });
    }
  } catch (error) {
    console.error('Error in addCommentController:', error);
    res.status(500).json({ isSuccess: false, message: 'Server error' });
  }
};

// 댓글 수정
export const updateCommentController: RequestHandler = async (req, res) => {
  try {
    const { commentId, commentContent, commentVisible } = req.body;

    if (!commentId || !commentContent || !commentVisible) {
      res
        .status(400)
        .json({ isSuccess: false, message: 'Missing required fields' });
      return;
    }

    await editComment({ commentId, commentContent, commentVisible });
    res.status(200).json({ isSuccess: true });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Comment not found') {
        res
          .status(404)
          .json({ isSuccess: false, message: '존재하지 않는 댓글입니다.' });
      } else {
        res.status(500).json({ isSuccess: false, message: error.message });
      }
    } else {
      res
        .status(500)
        .json({ isSuccess: false, message: 'Unknown server error' });
    }
  }
};

// 댓글 삭제
export const deleteCommentController: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { commentId } = req.body;

    if (!commentId) {
      res.status(400).json({
        isSuccess: false,
        message: '필수 필드가 누락되었습니다.',
      });
      return;
    }

    const result = await removeComment(commentId);

    if (result) {
      res.status(200).json({ isSuccess: true });
    } else {
      res.status(404).json({
        isSuccess: false,
        message: '댓글이 존재하지 않습니다.',
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({
        isSuccess: false,
        message: error.message,
      });
    } else {
      console.error('Unexpected error in deleteCommentController:', error);
      res.status(500).json({
        isSuccess: false,
        message: '서버 내부 오류입니다.',
      });
    }
  }
};

// 내가 작성한 댓글 조회
export const getMyCommentsController: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      res.status(400).json({
        isSuccess: false,
        message: 'User ID is missing from the query.',
      });
      return;
    }

    const response = await fetchMyComments(Number(userId));
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getMyCommentsController:', error);
    res.status(500).json({
      isSuccess: false,
      message: 'Internal server error',
    });
  }
};

// 특정 게시글의 댓글 조회
export const getCommentsByThreadController: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { threadId } = req.query;

    if (!threadId) {
      res.status(400).json({
        isSuccess: false,
        message: 'Thread ID is missing from the query parameters.',
      });
      return;
    }

    const response = await fetchCommentsByThread(Number(threadId));
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getCommentsByThreadController:', error);

    res.status(500).json({
      isSuccess: false,
      message: 'Internal server error occurred while fetching comments.',
    });
  }
};
