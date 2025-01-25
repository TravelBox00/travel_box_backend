/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
import { Request, Response } from 'express';
import * as threadService from './thread.service.ts';
import { CustomError, errors } from '../middlewares/error.middleware.ts';

// 게시물 좋아요
export const toggleLike = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { threadId, userId } = req.body;

    if (!threadId || !userId) {
      throw new CustomError(errors.NOT_PROVIDED_VALUES, new Error());
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
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        isSuccess: false,
        code: error.code,
        message: error.description,
        path: error.path,
      });
    } else {
      res.status(500).json({
        isSuccess: false,
        code: errors.SERVER_ERROR.code,
        message: errors.SERVER_ERROR.description,
        result: null,
      });
    }
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
      throw new CustomError(errors.NOT_PROVIDED_VALUES, new Error());
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
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        isSuccess: false,
        code: error.code,
        message: error.description,
        path: error.path,
      });
    } else {
      res.status(500).json({
        isSuccess: false,
        code: errors.SERVER_ERROR.code,
        message: errors.SERVER_ERROR.description,
        result: null,
      });
    }
  }
};
