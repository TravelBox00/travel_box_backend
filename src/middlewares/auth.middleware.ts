import jwt from 'jsonwebtoken';
import s3 from '../configs/database/s3Connect.ts';
import { refreshTokenDto } from '../user/dto/refreshToken.dto.ts';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const JWT_SECRET = process.env.JWT_SECRET!;
const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

// 액세스 & 리프레시 토큰 생성
export const generateTokens = (userTag: string) => {
    const accessToken = jwt.sign({ userTag }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userTag }, JWT_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

// S3에 리프레시 토큰 저장
export const storeRefreshTokenInS3 = async (userRefreshToken: refreshTokenDto): Promise<string> => {
    try {
        const userTag = userRefreshToken.userTag;
        const refreshToken = userRefreshToken.refreshToken;

        const params = {
            Bucket: S3_BUCKET_NAME,
            Key: `tokens/${userTag}.json`,
            Body: JSON.stringify({ refreshToken }),
            ContentType: 'application/json'
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);
        
        return refreshToken;  // 저장한 refreshToken을 그대로 반환
    } catch (error) {
        console.error("Error uploading refresh token to S3:", error);
        throw new Error("Failed to store refresh token in S3");
    }
};

// S3에서 리프레시 토큰 가져오기
export const getRefreshTokenFromS3 = async (userTag: string): Promise<string | null> => {
    try {

        const s3 = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
        const params = {
            Bucket: S3_BUCKET_NAME,
            Key: `tokens/${userTag}.json`
        };
        
        const command = new GetObjectCommand(params);
        const response = await s3.send(command);

        if (!response.Body) {
            return null;
        }
        const body = await response.Body.transformToString();
        const parsedData = JSON.parse(body);

        return parsedData.refreshToken;
    } catch (error) {
        console.error("Error retrieving refresh token from S3:", error);
        return null;
    }
};

/*
// JWT 검증 미들웨어 (보호된 API 요청 시 사용)
export const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.body.userId = (decoded as any).userId;
        next();
    });
};
*/
