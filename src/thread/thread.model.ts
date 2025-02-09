import { ResultSetHeader, RowDataPacket } from 'mysql2'; // ResultSetHeader 타입 임포트
import { pool } from '../configs/database/mysqlConnect.ts'; // DB 연결 설정
import { updatePostDTO, userPostDTO } from './dto/thread.dto.ts';
import { elastic } from '../configs/database/elasticConnect.ts';
import s3 from '../configs/s3.ts';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';


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

// 이미지 업로드 Model
export const uploadImageModel = {
  saveImage: async (
    threadId: number | null,
    imageURL: string
  ): Promise<any> => {
    console.log('POST saveImage');

    const query = `
      INSERT INTO Image (threadId, imageURL)
      VALUES (?, ?); 
    `;

    // 이미지 정보 DB에 저장
    const [result]: [ResultSetHeader, any[]] = await pool.query(query, [
      threadId,
      imageURL,
    ]);

    // 저장된 이미지의 imageId 반환
    return {
      imageId: result.insertId, // 삽입된 imageId를 반환
      threadId,
      imageURL,
    };
  },

  // threadId로 이미지를 조회하는 함수
  getImagesByThreadId: async (threadId: number): Promise<any[]> => {
    const query = `
      SELECT * 
      FROM Image 
      WHERE threadId = ?;
    `;

    // threadId에 해당하는 이미지들을 조회
    const [results] = await pool.query(query, [threadId]);

    return results as any[]; // 이미지 리스트 반환
  },
};

// 게시물 업로드 Model
export const upLoadPostModel = {
  createThread: async (
    userTag: string,
    postData: userPostDTO
  ): Promise<any> => {
    console.log('Creating new thread');
    console.log('User Tag:', userTag);

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 동일한 제목과 내용으로 최근에 생성된 게시물이 있는지 확인
      const checkDuplicateQuery = `
        SELECT threadId FROM TravelThread 
        WHERE postTitle = ? 
        AND postContent = ? 
        AND postDate > DATE_SUB(NOW(), INTERVAL 1 MINUTE)
      `;
      const [duplicates]: [any[], any] = await connection.query(
        checkDuplicateQuery,
        [postData.postTitle, postData.postContent]
      );

      if (duplicates.length > 0) {
        throw new Error('Duplicate post detected');
      }

      // userTag를 이용해 userId 조회
      const userQuery = `SELECT userId FROM User WHERE userTag = ?;`;
      const [userResult]: [any[], any] = await connection.query(userQuery, [
        userTag,
      ]);

      if (userResult.length === 0) {
        throw new Error('User not found');
      }

      const { userId } = userResult[0];

      // TravelThread에 thread 생성
      const threadQuery = `
        INSERT INTO TravelThread (userId, clothId, postCategory, postTitle, postContent, postDate)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
      const [threadResult]: [ResultSetHeader, any[]] = await connection.query(
        threadQuery,
        [
          userId,
          postData.clothId,
          postData.postCategory,
          postData.postTitle,
          postData.postContent,
          postData.postDate,
        ]
      );

      const threadId = threadResult.insertId;
      console.log(`Thread created with threadId: ${threadId}`);

      const splitContent = (content: string) => content.split(' ');

      // ElasticSearch에 데이터 추가
      const elasticDoc = {
        threadId,
        category: postData.postCategory,
        postTitle: splitContent(postData.postTitle),
        postContent: splitContent(postData.postContent),
        postDate: postData.postDate,
        postRegionCode: Math.floor(Math.random() * 100) + 1,
        likes: 0,
        comments: 0,
      };

      await elastic.index({
        index: 'post_stats',
        id: threadId.toString(),
        document: elasticDoc,
      });

      await connection.commit();

      return { threadId };
    } catch (error : any) {
      await connection.rollback();
      console.error('Error creating thread:', error);
      if (error.message === 'Duplicate post detected') {
        throw new Error('Duplicate post detected');
      }
      throw new Error('Failed to create thread');
    } finally {
      connection.release();
    }
  },
  // 게시물 생성이 취소될 경우 생성된 threadId 삭제
  deleteThread: async (threadId: number): Promise<void> => {
    console.log('Deleting thread with threadId:', threadId);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction(); // 트랜잭션 시작

      const deleteQuery = `DELETE FROM TravelThread WHERE threadId = ?`;
      await connection.query(deleteQuery, [threadId]);

      // ElasticSearch에서도 삭제
      await elastic.delete({
        index: 'post_stats',
        id: threadId.toString(),
      });

      await connection.commit(); // 트랜잭션 커밋

      console.log(`Thread=${threadId} deleted successfully`);
    } catch (error) {
      await connection.rollback(); // 오류 발생 시 롤백
      console.error('Error deleting thread:', error);
      throw new Error('Failed to delete thread');
    } finally {
      connection.release();
    }
  },
};



// 게시물 상세 조회 API
export const postInfoModel = async (
  userTag: string,
  threadId: number
): Promise<any> => {
  try {
    console.log('POST Model Connected');

    const query = `
      SELECT T.clothId, T.postCategory, T.postTitle, T.postContent, 
         DATE_FORMAT(T.postDate, "%Y-%m-%d") as postDate, 
         T.postRegionCode, I.imageURL as imageURL, U.userTag
      FROM TravelThread T
      JOIN User U ON T.userId = U.userId
      LEFT JOIN Image I ON T.threadId = I.threadId
      WHERE U.userTag LIKE ? COLLATE utf8mb4_general_ci 
      AND T.threadId = ?;
    `;

    // 부분 일치를 위해 userTag를 '%'로 감싸서 전달
    const [results] = await pool.query(query, [`%${userTag}%`, threadId]);

    console.log('Post Info Model Results:', results);

    return results;
  } catch (error) {
    console.error('게시물 상세 조회 Model Error', error);
    throw new Error('게시물 상세 조회 Model Error');
  }
};

// 게시물 검색 Model
export const postSearchModel = async (
  searchKeyword: string,
  limit: number,
  offset: number
): Promise<any> => {
  console.log('ElasticSearch + MySQL 기반 postSearch Model Connected');

  try {
    // 🔹 ElasticSearch 검색
    const { hits } = await elastic.search({
      index: 'post_stats',
      size: limit,
      from: offset,
      query: {
        multi_match: {
          query: searchKeyword,
          fields: ['postTitle^3', 'postContent'],
          fuzziness: 'AUTO',
        },
      },
    });

    const elasticResults = hits.hits.map((hit: any) => ({
      threadId: hit._id,
      postTitle: hit._source.postTitle,
      postDate: hit._source.postDate,
      postRegionCode: hit._source.postRegionCode,
      likes: hit._source.likes,
      comments: hit._source.comments,
    }));

    // MySQL 검색
    const mysqlQuery = `
      SELECT T.threadId, T.postTitle, DATE_FORMAT(T.postDate, "%Y-%m-%d") as postDate, I.imageURL
      FROM TravelThread T
      LEFT JOIN Image I ON T.threadId = I.threadId
      WHERE T.postTitle LIKE ? OR T.postContent LIKE ?
      LIMIT ? OFFSET ?;
    `;

    // MySQL 검색 실행
    const [mysqlResults]: any[] = await pool.query(mysqlQuery, [
      `%${searchKeyword}%`,
      `%${searchKeyword}%`,
      limit,
      offset,
    ]);

    // MySQL 결과가 배열인지 확인 후 변환
    const mysqlResultsArray = Array.isArray(mysqlResults) ? mysqlResults : [];

    // 두 결과를 병합 (ElasticSearch 결과를 우선)
    const combinedResults = [...elasticResults, ...mysqlResultsArray];

    return combinedResults;
  } catch (error) {
    console.error('검색 오류:', error);
    throw new Error('검색 실패');
  }
};

// 내가 쓴 글 조회 (이미지, 제목만)
export const myPostSearchModel = async (userTag: string): Promise<any> => {
  try {
    console.log('POST myPostSearchModel Connected');

    const query = `
      SELECT T.postTitle, I.imageURL as imageURL
      FROM TravelThread T
      LEFT JOIN Image I ON T.threadId = I.threadId
      WHERE T.userId = (SELECT userId FROM User WHERE userTag = ?) AND T.threadId;
    `;

    // 배열 디스트럭처링 -> 각 객체의 속성값을 접근할 수 있음
    const [results] = await pool.query(query, [userTag]);

    return results;
  } catch (error) {
    console.error('My Post Search Model Error', error);
    throw new Error('My Post Search Model Error');
  }
};

// Category 별로 조회
export const myPostCategoryModel = async (
  myCategory: string,
  userTag: string
): Promise<any> => {
  try {
    console.log('POST myPostCategoryModel Connected');

    const query = `
      SELECT T.postTitle, I.imageURL as imageURL
      FROM TravelThread T
      LEFT JOIN Image I ON T.threadId = I.threadId
      WHERE T.postCategory = ? AND T.userId = (SELECT userId FROM User WHERE userTag = ?);
    `;

    const [results] = await pool.query(query, [myCategory, userTag]);

    return results;
  } catch (error) {
    console.error('My Post Category Model Error', error);
    throw new Error('My Post Category Model Error');
  }
};

// 포스트 수정 Model
export const updatePostModel = async (
  userTag: string,
  threadId: number,
  postData: updatePostDTO
): Promise<any> => {
  try {
    console.log('PATCH updatePostModel Connected');

    // userTag와 threadId값을 확인하는 로직
    const userQuery = `SELECT userId FROM User WHERE userTag = ?;`;
    const [userResult]: any = await pool.query(userQuery, [userTag]);

    if (userResult.length === 0) {
      throw new Error(`userTag(${userTag})가 존재하지 않음.`);
    }

    const { userId } = userResult[0]; // userId 값 가져오기

    // threadId가 존재하는지 확인
    const threadQuery = `SELECT threadId FROM TravelThread WHERE userId = ? AND threadId = ?;`;
    const [threadResult]: any = await pool.query(threadQuery, [
      userId,
      threadId,
    ]);

    if (threadResult.length === 0) {
      throw new Error(`threadId(${threadId})가 존재하지 않음.`);
    }

    // 게시물 수정
    const updateQuery = `
      UPDATE TravelThread
      SET postCategory = ?, postTitle = ?, postContent = ?
      WHERE userId = ? AND threadId = ?;
    `;

    const [updateResult]: any = await pool.query(updateQuery, [
      postData.postCategory,
      postData.postTitle,
      postData.postContent,
      userId,
      threadId,
    ]);

     //postTitle과 postContent를 합쳐서 ElasticSearch에 저장할 배열 생성
     const splitContent = (content: string) => content.split(' ');

     const elasticDoc = {
       category: postData.postCategory,
       postTitle: splitContent(postData.postTitle),
       postContent: splitContent(postData.postContent),
     };
 
     // ElasticSearch에 데이터 업데이트 (PATCH 역할)
     await elastic.update({
       index: 'post_stats',
       id: threadId.toString(),
       doc: elasticDoc,  // 변경할 데이터
     });

     console.log(`threadId=${threadId} ElasticSearch 업데이트 완료`);

    return updateResult;
  } catch (error: any) {
    console.error('Update Post Model Error', error.message);
    throw new Error(error.message || 'Update Post Model Error');
  }
};

// 게시물 삭제 Model
export const deletePostModel = async (
  userTag: string,
  threadId: number
): Promise<any> => {
  try {
    console.log('DELETE deletePostModel Connected');

    // userTag와 threadId값을 확인하는 로직
    const userQuery = `SELECT userId FROM User WHERE userTag = ?;`;
    const [userResult]: any = await pool.query(userQuery, [userTag]);

    if (userResult.length === 0) {
      throw new Error(`userTag(${userTag})가 존재하지 않음.`);
    }

    const { userId } = userResult[0]; // userId 값 가져오기

    // threadId가 존재하는지 확인
    const threadQuery = `SELECT threadId FROM TravelThread WHERE userId = ? AND threadId = ?;`;
    const [threadResult]: any = await pool.query(threadQuery, [
      userId,
      threadId,
    ]);

    if (threadResult.length === 0) {
      throw new Error(`threadId(${threadId})가 존재하지 않음.`);
    }

    

      // 먼저 문서 존재 여부 확인
      const checkDocument = await elastic.search({
          index: 'post_stats',
          body: {
              query: {
                  match: {
                      threadId: threadId
                  }
              }
          }
      });
  
      console.log('검색 결과:', checkDocument.hits.hits);

  // ElasticSearch에서 해당 게시물 삭제
    const response = await elastic.deleteByQuery({
      index: 'post_stats', 
      body: {
        query: {
          bool: {
            must: [
              { term: { threadId: threadId } } 
            ]
          }
        }
      },
      refresh: true
    });

    // 삭제된 문서 수를 확인하고 로그 출력
    if (response && response.deleted !== undefined && response.deleted > 0) {
      console.log(`ElasticSearch에서 threadId ${threadId} 삭제 완료. 삭제된 문서 수: ${response.deleted}`);
    } else {
      console.log(`ElasticSearch에서 threadId ${threadId} 삭제 실패 또는 해당 문서 없음.`);
    }

    // 댓글 삭제
    const deleteCommentsQuery = `DELETE FROM Comment WHERE threadId = ?;`;
    await pool.query(deleteCommentsQuery, [threadId]);

    // 해시태그 삭제
    const deleteHashTagsQuery = `DELETE FROM HashTag WHERE threadId = ?;`;
    await pool.query(deleteHashTagsQuery, [threadId]);

    // 좋아요 삭제
    const deleteLikesQuery = `DELETE FROM \`Like\` WHERE threadId = ?;`;
    await pool.query(deleteLikesQuery, [threadId]);

    // 스크랩 삭제
    const deleteScrapQuery = `DELETE FROM PostScrap WHERE threadId = ?;`;
    await pool.query(deleteScrapQuery, [threadId]);

    // Sing
    const deleteSingQuery = `DELETE FROM Sing WHERE threadId = ?;`;
    await pool.query(deleteSingQuery, [threadId]);

    // 이미지 URL 조회 (삭제할 이미지를 가져오기 위해)
    const imageQuery = `SELECT imageURL FROM Image WHERE threadId = ?;`;
    const [imageResult]: any = await pool.query(imageQuery, [threadId]);

    if (imageResult.length > 0) {
      // 이미지 삭제 (S3에서)
      for (const image of imageResult) {
        const imageURL = image.imageURL;

        // URL을 디코딩
        const decodedURL = decodeURIComponent(imageURL);

        // URL에서 파일명 추출 (마지막 '/' 이후의 부분이 파일명)
        const fileName = decodedURL.substring(decodedURL.lastIndexOf('/') + 1);

        const params = {
          Bucket: process.env.AWS_BUCKET, // S3 버킷 이름
          Key: `image/${fileName}`, // 이미지 경로 (URL에서 추출한 파일명)
        };

        // S3에서 이미지 삭제
        await s3.send(new DeleteObjectCommand(params)); // v3 방식에서는 send 메서드를 사용
        console.log(`S3에서 이미지 삭제 완료: ${fileName}`);
      }
    }

    // 게시물 삭제 (이미지 먼저 삭제)
    const deleteImageQuery = `DELETE FROM Image WHERE threadId = ?;`;
    await pool.query(deleteImageQuery, [threadId]);

    // 게시물 삭제
    const deleteQuery = `DELETE FROM TravelThread WHERE userId = ? AND threadId = ?;`;
    const [deleteResult]: any = await pool.query(deleteQuery, [
      userId,
      threadId,
    ]);

    return deleteResult;
  } catch (error: any) {
    console.error('Delete Post Model Error', error.message);
    throw new Error(error.message || 'Delete Post Model Error');
  }
};


// 인기 게시물 조회 Model
export const popularPostModel = async (
  page: number,
  limit: number
): Promise<any> => {
  try {
    console.log('GET popularPostModel Connected');

    const offset = (page - 1) * limit;

    const query = `
      SELECT T.threadId, 
       T.postTitle, 
       DATE_FORMAT(T.postDate, "%Y-%m-%d") as postDate, 
       I.imageURL,
       (COALESCE(L.likeCount, 0) * 1 + COALESCE(C.commentCount, 0) * 1 + COALESCE(S.scrapCount, 0) * 1) AS totalEngagement
    FROM TravelThread T
    LEFT JOIN Image I ON T.threadId = I.threadId
    LEFT JOIN (
      SELECT threadId, COUNT(*) AS likeCount
      FROM \`Like\`
      GROUP BY threadId
      ) L ON T.threadId = L.threadId
    LEFT JOIN (
      SELECT threadId, COUNT(*) AS commentCount
      FROM Comment
      GROUP BY threadId
    ) C ON T.threadId = C.threadId
    LEFT JOIN (
      SELECT threadId, COUNT(*) AS scrapCount
      FROM PostScrap
      GROUP BY threadId
    ) S ON T.threadId = S.threadId
    ORDER BY totalEngagement DESC
    LiMIT ? OFFSET ?;`;

    const [results] = await pool.query(query, [limit, offset]);

    return results as any[];
  } catch (error) {
    console.error('Popular Post Model Error', error);
    throw new Error('Popular Post Model Error');
  }
};
