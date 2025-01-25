import { RequestHandler } from 'express';
// eslint-disable-next-line import/extensions
import { addComment } from './comment.service.ts';

// eslint-disable-next-line import/prefer-default-export
export const addCommentController: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { userId, threadId, commentContent, commentVisible } = req.body;

    if (!userId || !threadId || !commentContent || !commentVisible) {
      res
        .status(400)
        .json({ isSuccess: false, message: 'Missing required fields' });
      return;
    }

    const result = await addComment({
      userId,
      threadId,
      commentContent,
      commentVisible,
    });

    if (result) {
      res.status(201).json({ isSuccess: true });
    } else {
      res.status(500).json({ isSuccess: false });
    }
  } catch (error) {
    console.error('Error in addCommentController:', error);
    res.status(500).json({ isSuccess: false, message: 'Server error' });
  }
};
