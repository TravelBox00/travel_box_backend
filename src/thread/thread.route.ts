import express from 'express';
// eslint-disable-next-line import/extensions
import {
  toggleLike,
  toggleScrap,
  getScrappedThreads,
} from './thread.controller.ts';

const router = express.Router();

/**
 * @swagger
 * /thread/like:
 *   post:
 *     summary: 게시물 좋아요
 *     description: 좋아요 추가 시 isLiked가 true, 취소 시 isLiked가 false로 반환됩니다.
 *     tags:
 *       - Thread
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               threadId:
 *                 type: integer
 *                 description: 게시물 ID
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 description: 사용자 ID
 *                 example: 1
 *     responses:
 *       200:
 *         description: 현재 좋아요 상태 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   description: 요청 성공 여부
 *                   example: true
 *                 code:
 *                   type: string
 *                   description: 상태 코드
 *                   example: "2000"
 *                 message:
 *                   type: string
 *                   description: 처리 결과 메시지
 *                   example: "좋아요 성공"
 *                 result:
 *                   type: object
 *                   properties:
 *                     isLiked:
 *                       type: boolean
 *                       description: 현재 좋아요 상태
 *                       example: true
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /thread/scrap:
 *   post:
 *     summary: 게시물 스크랩
 *     description: 스크랩 추가 시 result.isScrapped가 true, 취소 시 result.isScrapped가 false로 반환됩니다.
 *     tags:
 *       - Thread
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               threadId:
 *                 type: integer
 *                 description: 게시물 ID
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 description: 사용자 ID
 *                 example: 1
 *     responses:
 *       200:
 *         description: 현재 스크랩 상태 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   description: 요청 성공 여부
 *                   example: true
 *                 code:
 *                   type: string
 *                   description: 상태 코드
 *                   example: "2000"
 *                 message:
 *                   type: string
 *                   description: 처리 결과 메시지
 *                   example: "스크랩 성공"
 *                 result:
 *                   type: object
 *                   properties:
 *                     isScrapped:
 *                       type: boolean
 *                       description: 현재 스크랩 상태
 *                       example: true
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /thread/scrap/info:
 *   get:
 *     summary: 스크랩한 게시물 목록 조회
 *     description: 게시물의 제목, 내용, 작성자 닉네임, 스크랩 상태, 사진 경로 반환
 *     tags:
 *       - Thread
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 스크랩한 게시물 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   description: 요청 성공 여부
 *                   example: true
 *                 code:
 *                   type: string
 *                   description: 상태 코드
 *                   example: "2000"
 *                 message:
 *                   type: string
 *                   description: 처리 결과 메시지
 *                   example: "스크랩한 게시물 목록 조회 성공"
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       threadId:
 *                         type: integer
 *                         description: 게시물 ID
 *                         example: 1
 *                       postTitle:
 *                         type: string
 *                         description: 게시물 제목
 *                         example: "Exploring Paris"
 *                       postContent:
 *                         type: string
 *                         description: 게시물 내용
 *                         example: "I visited Paris and it was breathtaking!"
 *                       userNickname:
 *                         type: string
 *                         description: 작성자 닉네임
 *                         example: "JohnDoe"
 *                       isScrapped:
 *                         type: boolean
 *                         description: 스크랩 여부
 *                         example: true
 *                       photoUrl:
 *                         type: string
 *                         description: 사진 경로
 *                         example: "https://example.com/image.jpg"
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */

// 게시물 좋아요
router.post('/like', toggleLike);

// 게시물 스크랩
router.post('/scrap', toggleScrap);

// 스크랩한 게시물 목록
router.get('/scrap/info', getScrappedThreads);

export default router;
