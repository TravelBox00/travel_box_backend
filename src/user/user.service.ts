import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import s3 from '../configs/database/s3Connect.ts';
import { CustomError, errors } from '../middlewares/error.middleware.ts';
import { generateTokens, storeRefreshTokenInS3 } from '../middlewares/auth.middleware.ts';

import { findUserByUserTag } from './user.model.ts';
import { loginReqDto, loginResDto } from "./dto/login.dto.ts"
import { refreshTokenDto } from './dto/refreshToken.dto.ts';
import { logoutReqDto, logoutResDto } from "./dto/logout.dto.ts"

export const loginService = async (userLoginInfo: loginReqDto) => {
    const userTag = userLoginInfo.userTag;
    const userPassword = userLoginInfo.userPassword;
    
    // user 정보 맞는지 확인
    const userInfo = await findUserByUserTag(userTag);
    if (!userInfo) throw new Error("User not found"); // custom error 적용시키기

    const isPasswordValid = await bcrypt.compare(userPassword, userInfo.userPassword);
    if (!isPasswordValid) throw new Error("Invalid credentials"); // custom error 적용시키기

    const { accessToken, refreshToken } = generateTokens(userInfo.userTag);

    const userRefreshToken: refreshTokenDto = {userTag, refreshToken}
    await storeRefreshTokenInS3(userRefreshToken);

    const userTokenInfo: loginResDto = { userTag: userInfo.userTag, accessToken, refreshToken };
    return userTokenInfo;
};

// 리프레시 토큰을 사용해 새 액세스 토큰 발급
export const refreshTokenService = async (userRefreshToken: refreshTokenDto) => {
    const refreshToken = userRefreshToken.refreshToken
    const userTag = userRefreshToken.userTag
    const storedToken = await storeRefreshTokenInS3(userRefreshToken);
    if (!storedToken || storedToken !== refreshToken) throw new Error("Invalid refresh token");

    return jwt.sign({ userTag }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};


// 로그아웃 (S3에서 토큰 삭제)
// ✅ 리프레시 토큰 삭제 (로그아웃)
export const logoutService = async (userTag: string): Promise<boolean> => {
    try {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: `tokens/${userTag}.json`
        };

        const command = new DeleteObjectCommand(params);
        await s3.send(command); // ✅ S3에서 삭제
        
        return true; // ✅ 성공 시 true 반환
    } catch (error) {
        console.error("Error deleting refresh token from S3:", error);
        throw new Error("Failed to delete refresh token from S3");
    }
};

