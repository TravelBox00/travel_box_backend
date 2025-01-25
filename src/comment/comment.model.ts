import { OkPacket, RowDataPacket } from 'mysql2';
import { pool } from '../configs/database/mysqlConnect.ts';

// 댓글 존재 확인
export const checkCommentExists = async (
  commentId: number
): Promise<boolean> => {
  const query = `SELECT COUNT(*) AS count FROM Comment WHERE commentId = ?`;

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [commentId]);

    const count = rows[0].count as number;
    return count > 0;
  } catch (error) {
    console.error('Error in checkCommentExists:', error);
    throw error;
  }
};

// 댓글 추가
// eslint-disable-next-line import/prefer-default-export
export const insertComment = async (commentData: {
  userId: number;
  threadId: number;
  commentContent: string;
  commentVisible: 'public' | 'private';
}) => {
  const { userId, threadId, commentContent, commentVisible } = commentData;

  const query = `
    INSERT INTO Comment (userId, threadId, commentContent, commentVisible, commentDate)
    VALUES (?, ?, ?, ?, CURDATE())
  `;

  try {
    const [result] = await pool.execute<OkPacket>(query, [
      userId,
      threadId,
      commentContent,
      commentVisible,
    ]);
    return result.insertId;
  } catch (error) {
    console.error('Error executing insertComment query:', error);
    throw error;
  }
};

// 댓글 수정
export const updateComment = async (commentData: {
  commentId: number;
  commentContent: string;
  commentVisible: 'public' | 'private';
}) => {
  const { commentId, commentContent, commentVisible } = commentData;

  const exists = await checkCommentExists(commentId);
  if (!exists) {
    throw new Error('Comment not found');
  }

  const query = `
    UPDATE Comment
    SET commentContent = ?, commentVisible = ?
    WHERE commentId = ?
  `;

  try {
    const [result] = await pool.execute(query, [
      commentContent,
      commentVisible,
      commentId,
    ]);
    return result;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

// 댓글 삭제
export const deleteComment = async (commentId: number): Promise<boolean> => {
  const exists = await checkCommentExists(commentId);

  if (!exists) {
    throw new Error('Comment not found');
  }

  const query = `
    DELETE FROM Comment
    WHERE commentId = ?
  `;

  try {
    const [result] = await pool.execute<OkPacket>(query, [commentId]);

    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
