import { Response, NextFunction } from 'express';
import { Upload } from '@aws-sdk/lib-storage';
import s3 from '../configs/s3.ts';
import {
  deletePostModel,
  myPostCategoryModel,
  myPostSearchModel,
  popularPostModel,
  postInfoModel,
  postSearchModel,
  updatePostModel,
  uploadImageModel,
  upLoadPostModel,
} from './thread.model.ts';
import { updatePostDTO, userPostDTO } from './dto/thread.dto.ts';

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

// 이미지 업로드 및 DB에 저장하는 서비스 함수
export const uploadImageService = async (
  threadId: number,
  files: Express.Multer.File[]
): Promise<{ locations: string[]; imageIds: number[] }> => {
  console.log('POST uploadImageService');

  if (!files || files.length === 0) {
    throw new Error('파일이 업로드되지 않았습니다.');
  }

  const bucketName = process.env.AWS_BUCKET;
  if (!bucketName) {
    throw new Error('S3 버킷이 설정되지 않았습니다.');
  }

  try {
    // 1. 파일 업로드
    const uploadPromises = files.map((file) => {
      const params = {
        Bucket: bucketName,
        Key: `image/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const upload = new Upload({ client: s3, params });
      return upload.done();
    });

    const results = await Promise.all(uploadPromises);
    const imageLocations = results
      .map((result: any) => result.Location)
      .filter((location) => location);

    // 2. 이미지 정보 DB 저장
    const imageIds = [];
    for (const location of imageLocations) {
      const imageInfoId = location; // S3에서 얻은 이미지 URL을 imageInfoId로 사용
      const imageInfo = await uploadImageModel.saveImage(threadId, imageInfoId);
      imageIds.push(imageInfo.imageId);
    }

    return { locations: imageLocations, imageIds };
  } catch (error) {
    console.error('이미지 업로드 및 저장 중 오류 발생:', error);
    throw new Error('이미지 업로드 및 저장 실패');
  }
};

// 게시물 업로드 서비스
export const upLoadPostService = async (
  userTag: string,
  postData: userPostDTO,
  imageLocations: string[],
  res: Response,
  next: NextFunction
): Promise<any> => {
  console.log('POST upLoadPostService: Service Started');

  try {
    console.log('POST upLoadPostService: Calling model to insert post data');

    // 게시물 데이터 및 이미지 정보 업로드
    const threadResponse = await upLoadPostModel.createThread(
      userTag,
      postData
    );

    if (!threadResponse) {
      console.error('POST upLoadPostService: Thread creation failed');
      return res.status(400).json({
        success: false,
        error: 'Post upload failed: Thread creation failed',
      });
    }

    console.log('POST upLoadPostService: Post upload success');
    res.status(201).json({ success: true, message: 'Post upload success' });
  } catch (error) {
    console.error('POST upLoadPostService: Error occurred', error);
    return next(error); // 전역 에러 핸들러로 전달
  }
};

// 포스트 상세 조회 서비스 함수
export const postInfoService = async (
  userTag: string,
  threadId: number,
  res: Response,
  next: NextFunction
): Promise<any> => {
  console.log('POST postInfoService Connected');

  try {
    const thread = await postInfoModel(userTag, threadId);

    if (!thread) {
      return res.status(400).json({ error: 'Post Info Failed' });
    }

    return thread;
  } catch (error) {
    console.error('Post Info Service Error', error);
    return next(error);
  }
};

// 검색어에 따른 포스트 조회 서비스 함수
export const postSearchService = async (
  searchKeyword: string,
  limit: number,
  offset: number
): Promise<any> => {
  try {
    console.log('postSearch Service Connected');

    const threads = await postSearchModel(searchKeyword, limit, offset);

    if (!threads) {
      return [];
    }

    return threads;
  } catch (error) {
    console.error('Post Search Service Error', error);
    throw error;
  }
};

// 내가 쓴 글 확인 서비스 함수 (제목, 이미지만)
export const myPostSearchService = async (userTag: string): Promise<any> => {
  try {
    console.log('POST myPostSearchService Connected');

    const threads = await myPostSearchModel(userTag);

    if (!threads) {
      return [];
    }

    return threads;
  } catch (error) {
    console.error('My Post Search Service Error', error);
    throw new Error('My Post Search Service Error');
  }
};

// Category 별로 조회 서비스 함수
export const myPostCategoryService = async (
  myCategory: string,
  userTag: string
): Promise<any> => {
  try {
    console.log('POST myPostCategoryService Connected');

    const threads = await myPostCategoryModel(myCategory, userTag);

    if (!threads || threads.length === 0) {
      return [];
    }

    return threads;
  } catch (error) {
    console.error('My Post Category Service Error', error);
    throw new Error('My Post Category Service Error');
  }
};

// 포스트 수정 서비스 함수
export const updatePostService = async (
  userTag: string,
  threadId: number,
  postData: updatePostDTO
): Promise<any> => {
  try {
    console.log('PUT updatePostService Connected');

    const result = await updatePostModel(userTag, threadId, postData);

    return result;
  } catch (error: any) {
    console.error('Update Post Service Error', error.message);
    throw new Error(error.message || 'Update Post Service Error');
  }
};

// 포스트 삭제 서비스 함수
export const deletePostService = async (
  userTag: string,
  threadId: number
): Promise<any> => {
  try {
    console.log('DELETE deletePostService Connected');

    const result = await deletePostModel(userTag, threadId);

    return result;
  } catch (error) {
    console.error('Delete Post Service Error', error);
    throw new Error('Delete Post Service Error');
  }
};

// 인기 게시물 조회 서비스 함수
export const popularPostService = async (
  page: number,
  limit: number
): Promise<any> => {
  try {
    console.log('GET popularPostService Connected');

    const threads = await popularPostModel(page, limit);

    if (!threads) {
      return [];
    }

    return threads;
  } catch (error) {
    console.error('Popular Post Service Error', error);
    throw new Error('Popular Post Service Error');
  }
};
