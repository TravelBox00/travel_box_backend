import { elastic } from '../configs/database/elasticConnect.ts';
import { pool } from '../configs/database/mysqlConnect.ts';
// Elasticsearch에서 인기있는 검색 결과를 가져오기 위한 함수
const popularElasticsearch = async (
  category?: string,
  region?: string,
  lastThreadId?: number
): Promise<number[]> => {
  console.log('lastThreadId', lastThreadId);
  const mustQueries = category ? [{ match: { category } }] : [];
  const filterQueries = region ? [{ term: { postRegionCode: region } }] : [];
  let size = 8;
  if (!lastThreadId) size = 2;
  try {
    const response = await elastic.search({
      index: 'post_stats',
      size,
      body: {
        query: {
          bool: {
            must: mustQueries,
            filter: filterQueries,
          },
        },
        sort: [
          { threadId: { order: 'desc' } }, // 정렬 기준 추가
        ],
        search_after: lastThreadId ? [lastThreadId] : undefined, // 이전 결과 다음의 데이터를 조회
      },
    });
    return response.hits.hits.map((hit: any) => hit._source.threadId);
  } catch (error) {
    console.error('Error fetching threads from Elasticsearch:', error);
    throw new Error('Failed to fetch threads due to Elasticsearch error');
  }
};

export const getTopRankedThreads = async (
  lastThreadId?: number
): Promise<number[]> =>
  popularElasticsearch(undefined, undefined, lastThreadId);

export const getRegionTopRankedThreads = async (
  region: string,
  lastThreadId?: number
): Promise<number[]> => popularElasticsearch(undefined, region, lastThreadId);

export const getCategoryFilterRankedThreads = async (
  category: string,
  lastThreadId?: number
): Promise<number[]> => popularElasticsearch(category, undefined, lastThreadId);

export const getFilterRankedThreads = async (
  category: string,
  region: string,
  lastThreadId?: number
): Promise<number[]> => popularElasticsearch(category, region, lastThreadId);

export const findUserTagByThreadId = async (threadId: number) => {
  try {
    const connection = await pool.getConnection();
    const query = `
              SELECT userTag
              FROM TravelThread as TT
              JOIN User as U
              ON TT.userId = U.userId 
              where TT.threadId = ?
              `;
    const [[row]]: any = await connection.execute(query, [threadId]);
    console.log('row', row);
    connection.release();
    return row;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};
