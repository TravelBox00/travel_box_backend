/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { RowDataPacket } from 'mysql2';
import { pool } from '../configs/database/mysqlConnect.ts';

// 게시물 좋아요 상태
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

// 게시물 스크랩 상태
export const checkScrapStatus = async (
  threadId: number,
  userId: number
): Promise<boolean> => {
  const query = `
    SELECT COUNT(*) AS scrapCount 
    FROM PostScrap
    WHERE threadId = ? AND userId = ?;
  `;
  const [rows] = await pool.query<RowDataPacket[]>(query, [threadId, userId]);
  return rows[0].scrapCount > 0;
};

// 스크랩 추가
export const addScrap = async (
  threadId: number,
  userId: number
): Promise<void> => {
  const query = `
    INSERT INTO PostScrap (threadId, userId)
    VALUES (?, ?);
  `;
  await pool.query(query, [threadId, userId]);
};

// 스크랩 삭제
export const removeScrap = async (
  threadId: number,
  userId: number
): Promise<void> => {
  const query = `
    DELETE FROM PostScrap
    WHERE threadId = ? AND userId = ?;
  `;
  await pool.query(query, [threadId, userId]);
};
