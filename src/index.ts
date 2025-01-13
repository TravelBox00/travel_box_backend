import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import { Router } from 'express';

// dotenv 설정
dotenv.config();

// Express 애플리케이션 생성
const app = express();
const port = process.env.PORT;

const router = Router();
router.get('/', (req, res) => {
  res.send('Welcome to the TravelBox!');
});

// 미들웨어 설정
app.use(cors()); // CORS 설정
app.use(express.json()); // JSON 요청 본문 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 요청 본문 파싱
app.use(compression()); // 응답 압축
app.use(morgan("dev")); // HTTP 로깅

app.use('/', router);

// 서버 실행
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
