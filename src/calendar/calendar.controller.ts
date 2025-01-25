/* eslint-disable import/prefer-default-export */
import { Request, Response, NextFunction } from 'express';
// eslint-disable-next-line import/extensions
import * as calendarService from './calendar.service.ts';

// 일정 추가
export const addCalendar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      userId,
      travelTitle,
      travelContent,
      travelStartDate,
      travelEndDate,
    } = req.body;

    if (!userId || !travelTitle) {
      res.status(400).json({
        isSuccess: false,
        message: 'userId와 travelTitle은 필수 입력값입니다.',
      });
      return;
    }

    const result = await calendarService.addCalendar({
      userId,
      travelTitle,
      travelContent,
      travelStartDate,
      travelEndDate,
    });

    if (result && result.travelId) {
      res.status(200).json({
        isSuccess: true,
        result: { travelId: result.travelId },
      });
    } else {
      res.status(500).json({
        isSuccess: false,
        message: '일정 추가에 실패했습니다. 다시 시도해주세요.',
      });
    }
  } catch (error) {
    console.error('Error in addCalendar:', error);
    res.status(500).json({
      isSuccess: false,
      message: '서버 내부 오류가 발생했습니다.',
    });
    next(error);
  }
};

// 일정 삭제
export const removeCalendar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { travelId } = req.body;

    if (!travelId) {
      res.status(400).json({ message: 'travelId는 필수 입력값입니다.' });
      return;
    }

    const result = await calendarService.removeCalendar(travelId);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: '해당 일정이 존재하지 않습니다.' });
      return;
    }

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 일정 수정
export const fixCalendar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      travelId,
      travelTitle,
      travelContent,
      travelStartDate,
      travelEndDate,
    } = req.body;

    if (!travelId) {
      res.status(400).json({ message: 'travelId는 필수 입력값입니다.' });
      return;
    }

    const result = await calendarService.fixCalendar({
      travelId,
      travelTitle,
      travelContent,
      travelStartDate,
      travelEndDate,
    });

    if (result.affectedRows === 0) {
      res.status(404).json({ message: '해당 일정이 존재하지 않습니다.' });
      return;
    }

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
