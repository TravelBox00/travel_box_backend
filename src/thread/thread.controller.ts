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
        isSuccess: false,
        code: '4000',
        message: 'threadId와 userId를 모두 제공해야 합니다.',
        result: null,
      });
      return;
    }

    const result = await threadService.toggleLike(threadId, userId);

    res.status(200).json({
      isSuccess: true,
      code: '2000',
      message: result.isLiked ? '좋아요 성공' : '좋아요 취소',
      result: {
        isLiked: result.isLiked,
      },
    });
  } catch (error) {
    console.error('좋아요 토글 API 에러:', error);
    res.status(500).json({
      isSuccess: false,
      code: '5000',
      message: '서버 오류',
      result: null,
    });
  }
};

// 게시물 스크랩
export const toggleScrap = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { threadId, userId } = req.body;

    if (!threadId || !userId) {
      res.status(400).json({
        isSuccess: false,
        code: '4000',
        message: 'threadId와 userId를 모두 제공해야 합니다.',
        result: null,
      });
      return;
    }

    const result = await threadService.toggleScrap(threadId, userId);

    res.status(200).json({
      isSuccess: true,
      code: '2000',
      message: result.isScrapped ? '스크랩 성공' : '스크랩 취소',
      result: {
        isScrapped: result.isScrapped,
      },
    });
  } catch (error) {
    console.error('스크랩 토글 API 에러:', error);
    res.status(500).json({
      isSuccess: false,
      code: '5000',
      message: '서버 오류',
      result: null,
    });
  }
};
