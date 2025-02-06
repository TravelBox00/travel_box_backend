import { CustomError, errors } from '../middlewares/error.middleware.ts';
import { searchResDto } from './dto/searchDto.ts';
import {
  getThread,
  searchValidSuggestions,
  getFastTimeThread,
} from './search.model.ts';
import {
  getCategoryFilterRankedThreads,
  getFilterRankedThreads,
  getRegionTopRankedThreads,
  getTopRankedThreads,
} from './searchPopul.model.ts';

export const searchService = async (word: string): Promise<searchResDto[]> => {
  const threadIds = await getFastTimeThread(word);

  if (threadIds.length === 0) {
    throw new CustomError(errors.NOT_FOUND_WORD, new Error());
  }

  const threads = await Promise.all(threadIds.map((id) => getThread(id)));
  const image = '';

  const searchData: searchResDto[] = threads.map((thread: any) => ({
    threadId: thread.threadId,
    postImageURL: image,
    postTitle: thread.title,
    postDate: thread.date,
  }));

  return searchData;
};

export const wordService = async (word: string): Promise<string[]> => {
  const words: string[] = await searchValidSuggestions(word);

  if (words.length === 0) {
    throw new CustomError(errors.NOT_FOUND_WORD, new Error());
  }
  return words;
};

export const filterService = async (
  category: string | undefined,
  region: string | undefined
): Promise<searchResDto[]> => {
  let threadIds: number[];

  if (category !== undefined && region !== undefined) {
    threadIds = await getFilterRankedThreads(category, region);
  } else if (category === undefined && region !== undefined) {
    threadIds = await getRegionTopRankedThreads(region);
  } else if (category !== undefined && region === undefined) {
    threadIds = await getCategoryFilterRankedThreads(category);
  } else {
    threadIds = await getTopRankedThreads();
  }

  if (threadIds.length === 0) {
    throw new CustomError(errors.NOT_FOUND_WORD, new Error());
  }

  const threads = await Promise.all(threadIds.map((id) => getThread(id)));
  const image = '';
  const searchData: searchResDto[] = threads.map((thread: any) => ({
    threadId: thread.threadId,
    postImageURL: image,
    postTitle: thread.title,
    postDate: thread.date,
  }));

  return searchData;
};
