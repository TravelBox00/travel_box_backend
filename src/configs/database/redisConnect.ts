import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Redis 클라이언트 생성
export const redisClient = new Redis({
  host: "localhost",// 수정 필요
  port: 6379,
 });

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error: ' + err);
});