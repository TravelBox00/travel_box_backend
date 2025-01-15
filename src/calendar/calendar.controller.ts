/* eslint-disable import/prefer-default-export */
import { Request, Response, NextFunction } from 'express';
// eslint-disable-next-line import/extensions
import * as calendarService from './calendar.service.ts';

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
      res
        .status(400)
        .json({ message: 'userId와 travelTitle은 필수 입력값입니다.' });
      return;
    }

    const result = await calendarService.addCalendar({
      userId,
      travelTitle,
      travelContent,
      travelStartDate,
      travelEndDate,
    });

    res
      .status(201)
      .json({ message: '일정 추가 완료', data: { travelId: result.travelId } });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
