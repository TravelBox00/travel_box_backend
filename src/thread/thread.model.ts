import { pool } from "../configs/database/mysqlConnect.ts"; // DB 연결 설정
import { ResultSetHeader } from 'mysql2'; // ResultSetHeader 타입 임포트
import { updatePostDTO, userPostDTO } from "./dto/thread.dto.ts";


// 이미지 업로드 Model
export const uploadImageModel = {
  saveImage: async (threadId: number | null, imageURL: string): Promise<any> => {
    console.log("POST saveImage");

    const query = `
      INSERT INTO Image (threadId, imageURL)
      VALUES (?, ?); 
    `;
    
    // 이미지 정보 DB에 저장
    const [result]: [ResultSetHeader, any[]] = await pool.query(query, [threadId, imageURL]);
    
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
  }
};


// 게시물 업로드 Model
export const upLoadPostModel = {
  // 게시물에 대한 threadId 생성
  createThread: async (userTag: string, postData: userPostDTO): Promise<any> => {
    console.log("Creating new thread");
    console.log("User Tag:", userTag);
  
    const connection = await pool.getConnection();
    
    try {
      // userTag를 이용해 userId 조회
      const userQuery = `SELECT userId FROM User WHERE userTag = ?;`;
      const [userResult]: [any[], any] = await connection.query(userQuery, [userTag]);
  
      // userTag가 없는 경우 처리
      if (userResult.length === 0) {
        throw new Error("User not found");
      }
  
      const userId = userResult[0].userId;
  
      // TravelThread에 thread 생성
      const threadQuery = `
        INSERT INTO TravelThread (userId, clothId, postCategory, postTitle, postContent, postDate)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
      const [threadResult]: [ResultSetHeader, any[]] = await connection.query(threadQuery, [
        userId,
        postData.clothId,
        postData.postCategory,
        postData.postTitle,
        postData.postContent,
        postData.postDate,
      ]);
  
      const threadId = threadResult.insertId;
      console.log(`Thread created with threadId: ${threadId}`);
      return { threadId }; // threadId 반환
    } catch (error) {
      console.error("Error creating thread:", error);
      throw new Error("Failed to create thread");
    } finally {
      connection.release();
    }
  },

  // 게시물 생성이 취소될 경우 생성된 threadId 삭제
  deleteThread: async (threadId: number): Promise<void> => {
    console.log("Deleting thread with threadId:", threadId);

    const connection = await pool.getConnection();
    try {
      const deleteQuery = `DELETE FROM TravelThread WHERE threadId = ?`;
      await connection.query(deleteQuery, [threadId]);
      console.log("Thread deleted successfully");
    } catch (error) {
      console.error("Error deleting thread:", error);
      throw new Error("Failed to delete thread");
    } finally {
      connection.release();
    }
  }
};

// 게시물 상세 조회 API
export const postInfoModel = async (
  userTag: string,
  threadId: number
): Promise<any> => {
  try {
    console.log("POST Model Connected");

    const query = `
      SELECT T.clothId, T.postCategory, T.postTitle, T.postContent, 
             DATE_FORMAT(T.postDate, "%Y-%m-%d") as postDate, 
             T.postRegionCode, I.imageURL as imageURL, U.userTag
      FROM TravelThread T
      JOIN User U ON T.userId = U.userId
      LEFT JOIN Image I ON T.threadId = I.threadId
      WHERE U.userTag LIKE ? COLLATE UTF8_GENERAL_CI 
      AND T.threadId = ?;
    `;

    // 부분 일치를 위해 userTag를 '%'로 감싸서 전달
    const [results] = await pool.query(query, [`%${userTag}%`, threadId]);

    console.log("Post Info Model Results:", results);

    return results;

  } catch (error) {
    console.error("게시물 상세 조회 Model Error", error);
    throw new Error("게시물 상세 조회 Model Error");
  }
};




// 검색어에 따른 게시물 조회 API
export const postSearchModel = async (
  searchKeyword: string,
  limit: number,
  offset: number
): Promise<any> => {
  console.log("postSearch Model Connected");

  const query = `
  SELECT T.postTitle, DATE_FORMAT(T.postDate, "%Y-%m-%d"), I.imageURL
  FROM TravelThread T
  LEFT JOIN Image I ON T.threadId = I.threadId
  WHERE T.postTitle LIKE ? OR I.imageURL LIKE ? OR T.postDate LIKE ?
  LIMIT ? OFFSET ?;
`;

  // 스크롤링 형식
  const [results] = await pool.query(query, [
    `%${searchKeyword}%`,
    `%${searchKeyword}%`,
    `%${searchKeyword}%`,
    limit,
    offset,
  ]);

  return results as any[];
};  


// 내가 쓴 글 조회 (이미지, 제목만)
export const myPostSearchModel = async (  
  userTag : string
): Promise<any> => {
  try {
    console.log("POST myPostSearchModel Connected");

    const query = `
      SELECT T.postTitle, I.imageURL as imageURL
      FROM TravelThread T
      LEFT JOIN Image I ON T.threadId = I.threadId
      WHERE T.userId = (SELECT userId FROM User WHERE userTag = ?) AND T.threadId;
    `;

    // 배열 디스트럭처링 -> 각 객체의 속성값을 접근할 수 있음
    const [results] = await pool.query(query, [userTag]);

    return results

  } catch (error) {
    console.error("My Post Search Model Error", error);
    throw new Error("My Post Search Model Error");
  }
};

// Category 별로 조회
export const myPostCategoryModel = async (
  myCategory : string,
  userTag : string
) : Promise<any> => {
  try {

    console.log("POST myPostCategoryModel Connected");

    const query = `
      SELECT T.postTitle, I.imageURL as imageURL
      FROM TravelThread T
      LEFT JOIN Image I ON T.threadId = I.threadId
      WHERE T.postCategory = ? AND T.userId = (SELECT userId FROM User WHERE userTag = ?);
    `;

    const [results] = await pool.query(query, [myCategory, userTag]);

    return results;
    
  } catch (error) {
    console.error("My Post Category Model Error", error);
    throw new Error("My Post Category Model Error");
  } 
};


// 포스트 수정 Model
export const updatePostModel = async (
  userTag : string,
  threadId : number,  
  postData : updatePostDTO
) : Promise<any> => {
  try {
    console.log("PUT updatePostModel Connected");

    // userTag와 threadId값을 확인하는 로직
    const userQuery = `SELECT userId FROM User WHERE userTag = ?;`;
    const [userResult]: any = await pool.query(userQuery, [userTag]);

    if (userResult.length === 0) {
      throw new Error(`userTag(${userTag})가 존재하지 않음.`);
    }

    const userId = userResult[0].userId; // userId 값 가져오기

    // threadId가 존재하는지 확인
    const threadQuery = `SELECT threadId FROM TravelThread WHERE userId = ? AND threadId = ?;`;
    const [threadResult]: any = await pool.query(threadQuery, [userId, threadId]);

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

    return updateResult;

  } catch (error : any) {
    console.error("Update Post Model Error", error.message);
    throw new Error(error.message || "Update Post Model Error");
  } 
};


// 포스트 삭제 Model
export const deletePostModel = async (
  userTag : string,
  threadId : number
) : Promise<any> => {
  try {
    console.log("DELETE deletePostModel Connected");

    // userTag와 threadId값을 확인하는 로직
    const userQuery = `SELECT userId FROM User WHERE userTag = ?;`;
    const [userResult]: any = await pool.query(userQuery, [userTag]);

    if (userResult.length === 0) {
      throw new Error(`userTag(${userTag})가 존재하지 않음.`);
    }

    const userId = userResult[0].userId; // userId 값 가져오기

    // threadId가 존재하는지 확인
    const threadQuery = `SELECT threadId FROM TravelThread WHERE userId = ? AND threadId = ?;`;
    const [threadResult]: any = await pool.query(threadQuery, [userId, threadId]);

    if (threadResult.length === 0) {
      throw new Error(`threadId(${threadId})가 존재하지 않음.`);
    }

    // 게시물 삭제 이미지 먼저 삭제 (외래 키 제약조건)  
    const delectImageQuery = `DELETE FROM Image WHERE threadId = ?;`;
    await pool.query(delectImageQuery, [threadId]);

    const deleteQuery = `DELETE FROM TravelThread WHERE userId = ? AND threadId = ?;`;
    const [deleteResult]: any = await pool.query(deleteQuery, [userId, threadId]);

    return deleteResult;

  } catch (error : any) {
    console.error("Delete Post Model Error", error.message);
    throw new Error(error.message || "Delete Post Model Error");
  }
};  


// 인기 게시물 조회 Model
export const popularPostModel = async (
  page: number, 
  limit: number 
): Promise<any> => {
  try {
    console.log("GET popularPostModel Connected");

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
    console.error("Popular Post Model Error", error);
    throw new Error("Popular Post Model Error");
  }
};