import express from 'express';
import {
  loginController,
  refreshTokenController,
  logoutController,
} from './controllers/userLogin.controller.ts';
import {
  signupController,
  duplicateController,
  signoutController,
  modifyController,
} from './controllers/userSign.controller.ts';
import { authenticateToken } from '../middlewares/auth.middleware.ts';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('User main route');
});

router.post('/login', loginController);
router.post('/login/refresh', refreshTokenController);
router.delete('/logout/:userTag', authenticateToken, logoutController);
router.post('/signup', signupController);
router.get('/signup/duplicate/:userTag', duplicateController);
router.delete('/signout/:userTag', authenticateToken, signoutController);
router.patch('/modify', authenticateToken, modifyController);

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: 사용자 관련 API
 */

/**
 * @swagger
 *  /users/login:
 *   post:
 *     summary: 사용자 로그인
 *     description: 사용자 로그인 후 accessToken과 refreshToken을 반환합니다.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userTag:
 *                 type: string
 *                 example: johndoe123
 *               userPassword:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userTag:
 *                   type: string
 *                   description: 사용자의 태그.
 *                   example: "ljm#123"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVGFnIjoibGptIzEyMyIsImlhdCI6MTczNzUyNTE3NiwiZXhwIjoxNzM3Nzg0Mzc2fQ.rwZBrS4-yK4xIZTffH1QmxHKLUGkf8Vl2tobEADwqYE"
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVGFnIjoibGptIzEyMyIsImlhdCI6MTczNzUyNTE3NiwiZXhwIjoxNzM4MTI5OTc2fQ.CO4Ys_jEn31J-7n-SB8h11aQ-0hNG8juP5xBpPfO9qw"
 *       401:
 *         description: Invalid password.
 *       404:
 *         description: User ID does not exist.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 *  /users/login/refresh:
 *   post:
 *     summary: Access Token 재발급
 *     description: Refresh Token을 사용하여 새로운 Access Token을 발급합니다.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userTag:
 *                 type: string
 *                 example: johndoe123
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: 토큰 재발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userTag:
 *                   type: string
 *                   description: 사용자의 태그.
 *                   example: "ljm#123"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVGFnIjoibGptIzEyMyIsImlhdCI6MTczNzUyNTE3NiwiZXhwIjoxNzM3Nzg0Mzc2fQ.rwZBrS4-yK4xIZTffH1QmxHKLUGkf8Vl2tobEADwqYE"
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVGFnIjoibGptIzEyMyIsImlhdCI6MTczNzUyNTE3NiwiZXhwIjoxNzM4MTI5OTc2fQ.CO4Ys_jEn31J-7n-SB8h11aQ-0hNG8juP5xBpPfO9qw"
 *       401:
 *         description: The token provided is invalid or expired.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 *  /users/logout:
 *   delete:
 *     summary: 로그아웃
 *     description: 사용자를 로그아웃하고 Refresh Token을 무효화합니다.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userTag:
 *                 type: string
 *                 example: johndoe123
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userTag:
 *                   type: null
 *                   description: null
 *                   example: ""
 *       404:
 *         description: User ID does not exist.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: 회원가입 (Create a new user)
 *     description: 새로운 사용자를 생성합니다.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userTag:
 *                 type: string
 *                 example: johndoe123
 *               userPassword:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               userNickname:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userTag:
 *                   type: null
 *                   description: null
 *                   example: ""
 *       403:
 *         description: |
 *           -Invalid nickname
 *           -Invalid password
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /users/signup/duplicate:
 *   get:
 *     summary: 아이디 중복 확인
 *     description: 새로운 사용자의 아이디(userTag)가 중복되는지 확인합니다.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userTag:
 *                 type: string
 *                 example: johndoe123
 *     responses:
 *       200:
 *         description: "true면 중복, false면 중복x"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAvailable:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 *  /users/signout:
 *   delete:
 *     summary: 회원탈퇴
 *     description: 회원탈퇴
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userTag:
 *                 type: string
 *                 example: johndoe123
 *     responses:
 *       200:
 *         description: 회원탈퇴 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userTag:
 *                   type: null
 *                   description: null
 *                   example: ""
 *       404:
 *         description: User ID does not exist.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 *  /users/modify:
 *   patch:
 *     summary: 사용자 정보 수정
 *     description: 사용자의 일부 정보를 수정합니다.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userTag:
 *                 type: string
 *                 example: johndoe123
 *               userPassword:
 *                 type: string
 *                 format: password
 *                 example: newpassword123
 *               userNickname:
 *                 type: string
 *                 example: "New Nickname"
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userTag:
 *                   type: null
 *                   description: null
 *                   example: ""
 *       403:
 *         description: |
 *            -Invalid nickname
 *            -Invalid password
 *       500:
 *         description: Internal Server Error.
 */

export default router;
