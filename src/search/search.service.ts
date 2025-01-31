import { CustomError, errors } from '../middlewares/error.middleware.ts';
import { searchResDto } from './dto/searchDto.ts';
import { searchFilterResDto } from './dto/searchFilterDto.ts';
import { getThread, getTopRankedThreads, getFilterRankedThreads, getRegionTopRankedThreads, getCategoryFilterRankedThreads } from './search.model.ts';

export const searchService = async (searchInfo:string):Promise<searchResDto> => {
    const threadId:number = 0
    const postImageURL: string = ""
    const postTitle: string = ""
    const postDate: Date = new Date();
    const searchData: searchResDto = {threadId, postImageURL, postTitle, postDate}
    return searchData
};  

export const regionService = async (searchInfo: searchFilterResDto):Promise<searchResDto> => {
    const {word, filter} = searchInfo




    const threadId:number = 0
    const postImageURL: string = ""
    const postTitle: string = ""
    const postDate: Date = new Date();
    const searchData: searchResDto = {threadId, postImageURL, postTitle, postDate}
    return searchData
};  


export const filterService = async (category: string | undefined, region: string | undefined): Promise<searchResDto[]> => {
    let threadIds: number[]

    if(category != undefined && region != undefined){
        threadIds = await getFilterRankedThreads(category, region);
        
    }else if(category == undefined && region != undefined){
        threadIds = await getRegionTopRankedThreads(region);

    }else if(category != undefined && region == undefined){
        threadIds = await getCategoryFilterRankedThreads(category);
        
    }else{
        threadIds = await getTopRankedThreads();
    }
    
    const threads = await Promise.all(threadIds.map((id) => getThread(id)));
    console.log('threads', threads)
    const searchData: searchResDto[] = threads.map((thread: any) => ({
      threadId: thread.threadId,
      postImageURL: thread.imageUrl,
      postTitle: thread.title,
      postDate: thread.date,
    }));
  
    return searchData;
  };
