import express from "express";
import {  filterController, searchController } from "./search.controller.ts";
const router = express.Router();

router.get("/", searchController);
router.get("/filter", filterController);

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: 검색 관련 API
 */

/**
 * @swagger
 * /search:
 *   get:
 *     summary: 검색 기능
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: word
 *         schema:
 *           type: string
 *         required: true
 *         description: 검색할 키워드
 *     responses:
 *       200:
 *         description: 검색 결과 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       threadId:
 *                         type: number
 *                         description: 게시물 ID
 *                         example: 12345
 *                       postImageURL:
 *                         type: string
 *                         description: 게시물 이미지 URL
 *                         example: "https://s3.example.com/uploads/thread12345.jpg"
 *                       postTitle:
 *                         type: string
 *                         description: 게시물 제목
 *                         example: "나의 첫 번째 여행"
 *                       postDate:
 *                         type: string
 *                         format: date-time
 *                         description: 게시물 작성 날짜
 *                         example: "2024-01-27T15:30:00.000Z"
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 */

/**
 * @swagger
 * /search/region:
 *   get:
 *     summary: 지역 검색
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: word
 *         schema:
 *           type: string
 *         required: true
 *         description: 검색할 지역명
 *     responses:
 *       200:
 *         description: 지역 검색 결과 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       threadId:
 *                         type: number
 *                         example: 54321
 *                       postImageURL:
 *                         type: string
 *                         example: "https://s3.example.com/uploads/thread54321.jpg"
 *                       postTitle:
 *                         type: string
 *                         example: "서울 여행 기록"
 *                       postDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-12-10T08:15:00.000Z"
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 */

/**
 * @swagger
 * /search/hashtag:
 *   get:
 *     summary: 해시태그 검색
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: word
 *         schema:
 *           type: string
 *         required: true
 *         description: 검색할 해시태그
 *     responses:
 *       200:
 *         description: 해시태그 검색 결과 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       threadId:
 *                         type: number
 *                         example: 67890
 *                       postImageURL:
 *                         type: string
 *                         example: "https://s3.example.com/uploads/thread67890.jpg"
 *                       postTitle:
 *                         type: string
 *                         example: "여행 필수템"
 *                       postDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-02-01T12:00:00.000Z"
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 */

/**
 * @swagger
 * /search/popular:
 *   get:
 *     summary: 인기 검색어 조회
 *     tags: [Search]
 *     responses:
 *       200:
 *         description: 인기 검색어 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       threadId:
 *                         type: number
 *                         example: 98765
 *                       postImageURL:
 *                         type: string
 *                         example: "https://s3.example.com/uploads/thread98765.jpg"
 *                       postTitle:
 *                         type: string
 *                         example: "가을 단풍 명소"
 *                       postDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-02-05T09:45:00.000Z"
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 */

export default router;
