import express from "express";
import {loginController, refreshTokenController, logoutController} from "./controllers/userLogin.controller.ts"
import {signupController, duplicateController, signoutController} from "./controllers/userSign.controller.ts"
import {authenticateToken} from "../middlewares/auth.middleware.ts"
const router = express.Router()

router.get("/", (req, res) => {
    res.send("User main route");
  });

router.post("/login", loginController);
router.post("/login/refresh", refreshTokenController);
router.post("/logout", logoutController);//get
router.post("/signup", signupController)// get
router.post("/signup/duplicate", duplicateController)//get
router.delete("/signout/:userTag" , signoutController)
// router.patch("/modify", modifyController)
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
 *       201:
 *         description: 사용자 생성 성공
 *       400:
 *         description: 요청 오류 (필수 필드 누락 등)
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /users/signup/duplicate:
 *   post:
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
 *         description: 아이디 사용 가능 여부 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAvailable:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: 요청 오류 (필수 필드 누락 등)
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /users/signout:
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
 *         description: 로그아웃 성공
 *       400:
 *         description: 요청 오류 (잘못된 사용자)
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /users/modify:
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
 *         description: 사용자 정보 일부 수정 성공
 *       400:
 *         description: 요청 오류
 *       500:
 *         description: 서버 오류
 */

export default router;
