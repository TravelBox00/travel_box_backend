import { Router } from 'express';
import { addCommentController } from './comment.controller.ts';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: 댓글 관련 API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /comment/add:
 *   post:
 *     summary: 댓글 추가
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *               threadId:
 *                 type: number
 *               commentContent:
 *                 type: string
 *               commentVisible:
 *                 type: string
 *                 enum: [public, private]
 *     responses:
 *       201:
 *         description: 댓글 추가 성공
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post('/add', addCommentController);

export default router;
