/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import * as threadModel from './thread.model.ts';

// 게시물 좋아요
export const toggleLike = async (
  threadId: number,
  userId: number
): Promise<{ message: string; isLiked: boolean }> => {
  try {
    const isLiked = await threadModel.checkLikeStatus(threadId, userId);

    if (isLiked) {
      // 좋아요 취소
      await threadModel.removeLike(threadId, userId);
      return { message: '좋아요 취소 성공', isLiked: false };
    }

    // 좋아요 추가
    await threadModel.addLike(threadId, userId);
    return { message: '좋아요 성공', isLiked: true };
  } catch (error) {
    console.error(`Error in toggleLike: ${error}`);
    return { message: '알 수 없는 에러가 발생했습니다.', isLiked: false };
  }
};
