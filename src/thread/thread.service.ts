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
      return { message: '좋아요 취소', isLiked: false };
    }

    // 좋아요 추가
    await threadModel.addLike(threadId, userId);
    return { message: '좋아요 성공', isLiked: true };
  } catch (error) {
    console.error(`Error in toggleLike: ${error}`);
    return { message: '에러 발생', isLiked: false };
  }
};

// 게시물 스크랩
export const toggleScrap = async (
  threadId: number,
  userId: number
): Promise<{ message: string; isScrapped: boolean }> => {
  try {
    const isScrapped = await threadModel.checkScrapStatus(threadId, userId);

    if (isScrapped) {
      // 스크랩 취소
      await threadModel.removeScrap(threadId, userId);
      return { message: '스크랩 취소', isScrapped: false };
    }

    // 스크랩 추가
    await threadModel.addScrap(threadId, userId);
    return { message: '스크랩 성공', isScrapped: true };
  } catch (error) {
    console.error(`Error in toggleScrap: ${error}`);
    return { message: '에러 발생', isScrapped: false };
  }
};

// 스크랩한 게시물 목록
export const getScrappedThreads = async (
  userId: number
): Promise<{
  message: string;
  scrappedThreads: Array<{
    threadId: number;
    postTitle: string;
    postContent: string;
    userNickname: string;
    isScrapped: boolean;
    photoUrl: string;
  }>;
}> => {
  try {
    const scrappedThreads = await threadModel.getScrappedThreads(userId);
    return {
      message: '스크랩 목록 조회 성공',
      scrappedThreads,
    };
  } catch (error) {
    console.error(`Error in getScrappedThreads: ${error}`);
    throw new Error('스크랩 목록 조회 실패');
  }
};
