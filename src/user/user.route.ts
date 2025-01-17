import express from "express";
import {loginController, refreshTokenController, logoutController} from "./user.controller.ts"
const router = express.Router()

router.get("/", (req, res) => {
    res.send("User main route");
  });

router.use("/login", loginController);
router.use("/login/refresh", refreshTokenController);
router.use("/logout", logoutController);

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: 사용자 관련 API
 */

/**
 * @swagger
 * /users/login:
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
 *       401:
 *         description: 로그인 실패 (잘못된 자격 증명)
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /users/login/refresh:
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
 *         description: 새 Access Token 발급 완료
 *       401:
 *         description: 잘못된 Refresh Token
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /users/logout:
 *   post:
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
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 오류
 */

export default router;
