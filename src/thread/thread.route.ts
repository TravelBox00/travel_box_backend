import express from 'express';
// eslint-disable-next-line import/extensions
import { toggleLike } from './thread.controller.ts';

const router = express.Router();

/**
 * @swagger
 * /thread/like:
 *   post:
 *     summary: 게시물 좋아요
 *     description: 좋아요 추가시 isLiked가 true, 취소시 isLiked가 false
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
 *               userId:
 *                 type: integer
 *                 description: 사용자 ID
 *     responses:
 *       200:
 *         description: 현재 좋아요 상태 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 처리 결과 메시지
 *                 isLiked:
 *                   type: boolean
 *                   description: 현재 좋아요 상태
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */

router.post('/like', toggleLike);

export default router;
