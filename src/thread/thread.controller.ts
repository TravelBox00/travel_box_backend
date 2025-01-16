/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
import { Request, Response } from 'express';
import * as threadService from './thread.service.ts';

// 게시물 좋아요
export const toggleLike = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { threadId, userId } = req.body;

    if (!threadId || !userId) {
      res.status(400).json({
        message: 'threadId와 userId를 모두 제공해야 합니다.',
        isLiked: false,
      });
      return;
    }

    const result = await threadService.toggleLike(threadId, userId);

    res.status(200).json({
      message: result.message,
      isLiked: result.isLiked,
    });
  } catch (error) {
    console.error('좋아요 토글 API 에러:', error);
    res.status(500).json({
      message: '서버 오류',
      isLiked: false,
    });
  }
};
