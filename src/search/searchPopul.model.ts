import { elastic } from '../configs/database/elasticConnect.ts';

const popularElasticsearch = async (
  category?: string,
  region?: string
): Promise<number[]> => {
  try {
    const mustQueries = category ? [{ match: { category } }] : [];
    const filterQueries = region ? [{ term: { postRegionCode: region } }] : [];

    const response = await elastic.search({
      index: 'post_stats',
      size: 8,
      body: {
        query: {
          bool: {
            must: mustQueries,
            filter: filterQueries,
          },
        },
        sort: [
          {
            _script: {
              type: 'number',
              script: {
                source: "doc['likes'].value * 2 + doc['comments'].value * 2",
                lang: 'painless',
              },
              order: 'desc',
            },
          },
        ],
      },
    });

    return response.hits.hits.map((hit: any) => hit._source.threadId);
  } catch (error) {
    throw new Error();
  }
};

export const getTopRankedThreads = async (): Promise<number[]> =>
  popularElasticsearch();

export const getRegionTopRankedThreads = async (
  region: string
): Promise<number[]> => popularElasticsearch(undefined, region);

export const getCategoryFilterRankedThreads = async (
  category: string
): Promise<number[]> => popularElasticsearch(category);

export const getFilterRankedThreads = async (
  category: string,
  region: string
): Promise<number[]> => popularElasticsearch(category, region);
