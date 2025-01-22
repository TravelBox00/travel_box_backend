import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

// 액세스 & 리프레시 토큰 생성
export const generateTokens = (userTag: string) => {
    try{
        const accessToken = jwt.sign({ userTag }, JWT_SECRET, { expiresIn: '3d' });
        const refreshToken = jwt.sign({ userTag }, JWT_SECRET, { expiresIn: '7d' });

        return { accessToken, refreshToken };
    }catch(error){
        console.error(error)
    }
};

export const authenticateToken = (req: Request, res:Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];// 토큰을 header에서 확인
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {// 유효성 검사
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.body.userTag = (decoded as any).userTag;// any는 토큰 저장된거 확인하면서 바꿀 수 있으면 바꾸기
        next();
    });
};
/*
사용 방법
app.get('/users', authenticateToken, (req, res) => {});
*/