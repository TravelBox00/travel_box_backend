import { NextFunction, Request, Response } from "express";
import { filterService, searchService } from "./search.service.ts";
import { searchResDto } from "./dto/searchDto.ts";
import { searchFilterResDto } from "./dto/searchFilterDto.ts";

export const searchController = async (req:Request, res:Response, next:NextFunction): Promise<void> => {// 시간별 검색된 게시물 반환
    try{
        const searchReq: string = req.params.word;
        const searchRes: searchResDto = await searchService(searchReq);
        
        res.status(200).json({ result: searchRes, isSuccess: true });
    }catch (error) {
      next(error)
    }
}

export const wordController = async (req:Request, res:Response, next:NextFunction): Promise<void> => {// 검색어 입력시 자동완성 단어 반환
  try{
      const searchReq: string = req.params.word;
      const searchRes: searchResDto = await searchService(searchReq);
      
      res.status(200).json({ result: searchRes, isSuccess: true });
  }catch (error) {
    next(error)
  }
}

export const filterController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {// 
  try {
    const category: string | undefined = req.query.filter as string | undefined;
    const region: string | undefined = req.query.filter as string | undefined;
    const searchRes: searchResDto[] = await filterService(category, region); 

    res.status(200).json({ result: searchRes, isSuccess: true });
  } catch (error) {
    next(error);
  }
};
