import { insertComment } from './comment.model.ts';

// eslint-disable-next-line import/prefer-default-export
export const addComment = async (commentData: {
  userId: number;
  threadId: number;
  commentContent: string;
  commentVisible: 'public' | 'private';
}) => {
  try {
    const result = await insertComment(commentData);

    return !!result;
  } catch (error) {
    console.error('Error in addComment service:', error);
    return false;
  }
};
