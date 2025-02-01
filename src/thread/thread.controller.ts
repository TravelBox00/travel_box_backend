import { Request, Response, NextFunction } from "express";
import { deletePostService, myPostCategoryService, myPostSearchService, popularPostService, postInfoService, postSearchService, updatePostService, uploadImageService, upLoadPostService } from "./thread.service.ts"; // 서비스에서 작성한 업로드 함수
import { updatePostDTO, userPostDTO } from "./dto/thread.dto.ts";
import { upLoadPostModel } from "./thread.model.ts";


// 이미지 업로드 Controller
// export const uploadImageController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     const threadId = req.body.threadId; // threadId 추출
//     const files = req.files as Express.Multer.File[]; // Multer 파일 처리

//     // uploadImageService에 threadId와 files를 넘겨줌
//     return await uploadImageService(threadId, files, res, next);  
//   } catch (error) {
//     console.error("Image Upload Controller Error", error);
//     res.status(400).json({ error: "Image Upload Controller Error" });
//     throw new Error("Image Upload Controller Error");
//   }
// };


  // 게시물 업로드 Controller
  export const upLoadPostController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    console.log("POST upLoadPostController");

    // 문자열로 된 JSON 파싱
    const parsedBody = JSON.parse(req.body.body);
    const { userTag, postCategory, postTitle, postContent, clothId } = parsedBody;

    console.log("Parsed Request Body:", parsedBody);
    console.log("User Tag:", userTag);

    const postDate = new Date();

    const postData: userPostDTO = {
      postCategory,
      postTitle,
      postContent,
      postDate,
      clothId,
    };

    try {
      // thread 생성
      const threadResponse = await upLoadPostModel.createThread(userTag, postData);
      const threadId = threadResponse.threadId;

      if (!threadId) {
        return res.status(400).json({ error: "Thread creation failed" });
      }

      // 이미지 업로드
      const imageResponse = await uploadImageService(threadId, req.files as Express.Multer.File[]);
      console.log("Image Upload Response:", imageResponse);

      if (!imageResponse || !imageResponse.locations || imageResponse.locations.length === 0) {
        // 이미지 업로드 실패 시, 생성한 threadId 삭제
        await upLoadPostModel.deleteThread(threadId);
        return res.status(400).json({ error: "Image Upload Error: No images uploaded" });
      }

      const imageLocations = imageResponse.locations;

      // 게시물 업로드 서비스 호출
      const postResponse = await upLoadPostService(userTag, postData, imageLocations, res, next);
      return res.status(201).json(postResponse);
    } catch (error : any) {
      console.error("Post Upload Controller Error", error.message);
      res.status(400).json({ error: "Post Upload Controller Error" });  
      throw new Error( error.message || "Post Upload Controller Error");
    }
  };


// 포스트 상세 조회 Controller
export const postInfoController = async (
  req : Request,
  res : Response,
  next : NextFunction
) : Promise<any> => {
  try { 
    const userTag  = req.query.userTag as string;
    const threadId = Number(req.query.threadId);

    console.log("POST info controller conneted");
    console.log("User Tag : ", userTag);
    console.log("Thread Id : ", threadId);

    const result = await postInfoService(userTag, threadId, res, next);
    return res.status(200).json(result);

  } catch (error) {
    console.error("Post Info Controller Error", error);
    res.status(400).json({ error: "Post Info Controller Error" });
    throw new Error("Post Info Controller Error");
  }
};


// 검색어에 따른 포스트 조회 Controller
export const postSearchController = async ( 
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    console.log("POST search controller connected");

    const searchKeyword = req.query.searchKeyword as string;
    const limit = 10; // 정해진 값
    let offset = 0;

    console.log("searchKeyword:", searchKeyword);

    if (!searchKeyword) {
      return res.status(400).json({ error: "searchKeyword is required" });
    } 

    if (req.query.offset) {
      offset = Number(req.query.offset);
    }

    const result = await postSearchService(searchKeyword, limit, offset);
    return res.status(200).json(result);

  } catch (error) {
    console.error("Post Search Controller Error", error);
    res.status(400).json({ error: "Post Search Controller Error" });
    throw new Error("Post Search Controller Error");
  }
};


// 내가 쓴 글 확인 Controller (제목, 이미지만)
export const myPostSearchController = async (
  req : Request,
  res : Response,
  next : NextFunction
): Promise<any> => {
 try {
    console.log("POST myPostSearchController Connected");
    
    const userTag = req.query.userTag as string;  

    console.log("User Tag" , userTag);

    const result = await myPostSearchService(userTag);

    return res.status(200).json(result);

 } catch (error) {
    console.error("my Post Search Contorller Error", error);
    res.status(400).json({ error: "My Post Search Controller Error" });
    throw new Error("My Post Search Controller Error");
 }
};

// Category 별로 조회 Controller
export const myPostCategoryController = async (
  req : Request,
  res : Response,
  next : NextFunction
) : Promise<any> => {
  try {
    console.log("POST myPostCategoryController Connected");

    const myCategory = req.query.myCategory as string;
    const userTag = req.query.userTag as string;

    console.log("My Category:", myCategory);
    console.log("User Tag:", userTag);

    if (myCategory !== "여행 기록" 
      && myCategory !== "기념품" 
      && myCategory !== "여행지" 
      && myCategory !== "여행 코디") {
    console.log("Invalid category:", myCategory);

    return res.status(400).json({ error: "Category is Enum, must be one of 여행 기록, 기념품, 여행지, 여행 코디" });
  }
  
    const result =  await myPostCategoryService(myCategory, userTag);
    return res.status(200).json(result);

  } catch (error) {
    console.error("My Post Category Controller Error", error);
    res.status(400).json({ error: "My Post Category Controller Error" });
    throw new Error("My Post Category Controller Error");
  }
};



// 포스트 수정 Controller
export const updatePostController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  console.log("PUT updatePostController Connected");

  try {
    const { userTag, threadId, postCategory, postTitle, postContent } = req.body;
    
    // 카테고리 확인인
  if (postCategory !== "여행 기록" 
    && postCategory !== "기념품" 
    && postCategory !== "여행지" 
    && postCategory !== "여행 코디") {
  console.log("Invalid category:", postCategory);

  return res.status(400).json({ error: "Category is Enum, must be one of 여행 기록, 기념품, 여행지, 여행 코디" });
  }

  // postTitle 제목 존재 여부 확인
  if (!postTitle || postTitle.length < 5) {
    if(postTitle.length === 5) {
      console.log("Invalid postTitle:", postTitle);
      return res.status(400).json({ error: "postTitle lenght must over 5 word" });
    }
    console.log("Invalid postTitle:", postTitle);
    return res.status(400).json({ error: "postTitle is required" });
  }

  // postContent 내용 존재 여부 확인
  if (!postContent) {
    console.log("Invalid postContent:", postContent);
    return res.status(400).json({ error: "postContent is required" });
  }

    const postData: updatePostDTO = {
      postCategory,
      postTitle,
      postContent,
    };


    const result = await updatePostService(userTag, threadId, postData);
    return res.status(200).json(result);

  } catch (error : any) {
    console.error("Update Post Controller Error", error.message);
    return res.status(400).json({ error: error.message || "Update Post Controller Error" });
  }
};

// 포스트 삭제 Controller
export const deletePostController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  console.log("DELETE deletePostController Connected");

  try {
    const { userTag, threadId } = req.body;

    const result = await deletePostService(userTag, threadId);
    return res.status(200).json(result);

  } catch (error : any) {
    console.error("Delete Post Controller Error", error.message);
    return res.status(400).json({ error: error.message || "Delete Post Controller Error" });
  }
};

// 인기 게시물 조회 Controller
export const popularPostController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    console.log("GET popularPostController Connected");

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await popularPostService(page, limit);

    return res.status(200).json(result);

  } catch (error) {
    console.error("Popular Post Controller Error", error);
    return res.status(400).json({ error: "Popular Post Controller Error" });
  }
};  
