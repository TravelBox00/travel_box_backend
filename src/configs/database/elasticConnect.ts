import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
dotenv.config();

export const elastic = new Client({
  node: process.env.ELASTIC_SEARCH,
  auth: {
    apiKey: process.env.ELASTIC_SEARCH_API!,
  },
});

