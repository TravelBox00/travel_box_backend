/* eslint-disable import/prefer-default-export */
/* eslint-disable no-return-await */
/* eslint-disable import/extensions */
import * as calendarModel from './calendar.model.ts';
import { Calendar } from './calendar.model.ts';

export const addCalendar = async (
  calendar: Calendar
): Promise<{ travelId: number }> => {
  // calendarModel.insertCalendar 호출 후 반환된 result에서 travelId를 사용
  const result = await calendarModel.insertCalendar(calendar);
  return result; // travelId 반환
};
