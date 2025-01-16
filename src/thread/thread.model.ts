/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { RowDataPacket } from 'mysql2';
import { pool } from '../configs/database/mysqlConnect.ts';

export const checkLikeStatus = async (
  threadId: number,
  userId: number
): Promise<boolean> => {
  const query = `
    SELECT COUNT(*) AS likeCount 
    FROM \`Like\`
    WHERE threadId = ? AND userId = ?;
  `;

  const [rows] = await pool.query<RowDataPacket[]>(query, [threadId, userId]);
  const likeCount = rows[0].likeCount as number;

  return likeCount > 0;
};

// 좋아요 추가
export const addLike = async (threadId: number, userId: number) => {
  const query = `
    INSERT INTO \`Like\` (threadId, userId)
    VALUES (?, ?);
  `;
  await pool.query(query, [threadId, userId]);
};

// 좋아요 삭제
export const removeLike = async (threadId: number, userId: number) => {
  const query = `
    DELETE FROM \`Like\`
    WHERE threadId = ? AND userId = ?;
  `;
  await pool.query(query, [threadId, userId]);
};
