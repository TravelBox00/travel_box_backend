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

// 스크랩한 게시물 목록
export const getScrappedThreads = async (
  userId: number
): Promise<
  Array<{
    threadId: number;
    postTitle: string;
    postContent: string;
    userNickname: string;
    isScrapped: boolean;
    photoUrl: string;
  }>
> => {
  const query = `
    SELECT 
      t.threadId,
      t.postTitle,
      t.postContent,
      u.userNickname,
      CASE WHEN ps.scrapId IS NOT NULL THEN 1 ELSE 0 END AS isScrapped, 
      i.imageInfoId AS photoUrl 
    FROM PostScrap ps
    INNER JOIN TravelThread t ON ps.threadId = t.threadId
    INNER JOIN User u ON t.userId = u.userId
    LEFT JOIN Image i ON t.threadId = i.threadId
    WHERE ps.userId = ?;
  `;

  const [rows] = await pool.query<RowDataPacket[]>(query, [userId]);

  return rows.map((row) => ({
    threadId: row.threadId,
    postTitle: row.postTitle,
    postContent: row.postContent,
    userNickname: row.userNickname,
    isScrapped: !!row.isScrapped,
    photoUrl: row.photoUrl || '',
  })) as Array<{
    threadId: number;
    postTitle: string;
    postContent: string;
    userNickname: string;
    isScrapped: boolean;
    photoUrl: string;
  }>;
};
