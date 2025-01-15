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
  // result.insertId는 삽입된 레코드의 자동 생성된 ID (travelId)입니다.
  return { travelId: result.insertId };
};
