import { elastic } from '../configs/database/elasticConnect.ts';
import { pool } from '../configs/database/mysqlConnect.ts';

export const getThread = async (threadId: number) => {
  try {
    const query = `
        SELECT threadId, postTitle AS title, postDate AS date 
        FROM TravelThread 
        WHERE threadId = ?
        `;

    const [rows]: any = await pool.execute(query, [threadId]);

    return rows[0];
  } catch (error) {
    throw new Error();
  }
};

export const searchValidSuggestions = async (
  word: string
): Promise<string[]> => {
  try {
    const [regionResponse, postResponse] = await Promise.all([
      elastic.search({
        index: 'region_suggestions',
        size: 5,
        body: {
          query: {
            bool: {
              should: [
                { match_phrase_prefix: { country: word } },
                { match_phrase_prefix: { city: word } },
                { match_phrase_prefix: { area: word } },
                { match_phrase_prefix: { continent: word } },
                { match_phrase_prefix: { region_hierarchy: word } },
              ],
              minimum_should_match: 1,
            },
          },
        },
      }),
      elastic.search({
        index: 'post_stats',
        size: 5,
        body: {
          query: {
            bool: {
              should: [
                { match_phrase_prefix: { postTitle: word } },
                { term: { 'postContent.keyword': word } },
                { match_phrase_prefix: { category: word } },
                { match_phrase_prefix: { region_hierarchy: word } },
              ],
              minimum_should_match: 1,
            },
          },
        },
      }),
    ]);

    const suggestedRegions = regionResponse.hits.hits.flatMap(
      (hit: any) => hit._source.region_hierarchy
    );

    const suggestedPosts = postResponse.hits.hits.map(
      (hit: any) => hit._source.postTitle
    );

    return Array.from(new Set([...suggestedRegions, ...suggestedPosts]));
  } catch (error) {
    throw new Error('');
  }
};

export const getFastTimeThread = async (word: string): Promise<number[]> => {
  try {
    const response = await elastic.search({
      index: 'post_stats',
      size: 8,
      body: {
        query: {
          bool: {
            should: [
              { match: { 'postTitle.keyword': word } },
              { term: { 'postContent.keyword': word } },
              { match: { category: word } },
              { match: { region_hierarchy: word } },
            ],
            minimum_should_match: 1,
          },
        },
        sort: [{ postDate: 'desc' }],
      },
    });
    return response.hits.hits.map((hit: any) => hit._source.threadId);
  } catch (error) {
    throw new Error();
  }
};
