import { pool } from '../configs/database/mysqlConnect.ts';

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
    const [result] = await pool.execute(query, [
      userId,
      threadId,
      commentContent,
      commentVisible,
    ]);
    return result;
  } catch (error) {
    console.error('Error executing insertComment query:', error);
    throw error;
  }
};
