// eslint-disable-next-line import/extensions
import { ResultSetHeader } from 'mysql2';
import { pool } from '../configs/database/mysqlConnect.ts';

export interface Calendar {
  userId: number;
  travelTitle: string;
  travelContent?: string;
  travelStartDate?: string;
  travelEndDate?: string;
}

// 일정 추가
export const insertCalendar = async (calendar: Calendar) => {
  const query = `
    INSERT INTO TravelCalendar (userId, travelTitle, travelContent, travelStartDate, travelEndDate)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    calendar.userId,
    calendar.travelTitle,
    calendar.travelContent || null,
    calendar.travelStartDate || null,
    calendar.travelEndDate || null,
  ];

  const [result] = await pool.query<ResultSetHeader>(query, values);
  return { travelId: result.insertId };
};

// 일정 삭제
export const removeCalendar = async (travelId: number) => {
  const query = `
    DELETE FROM TravelCalendar
    WHERE travelId = ?
  `;

  const [result] = await pool.query(query, [travelId]);
  return result;
};
