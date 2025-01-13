import express from 'express';
import { Router } from 'express';
// 라우터 설정
const router = Router();
router.get('/', (req, res) => {
    res.send('Welcome to the modern module world!');
});
// Express 앱 설정
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/', router);
// 서버 시작
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
