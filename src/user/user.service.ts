import bcrypt from 'bcrypt';
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import s3 from '../configs/database/s3Connect.ts';
import { CustomError, errors } from '../middlewares/error.middleware.ts';
import { generateTokens } from '../middlewares/auth.middleware.ts';

import { findUserByUserTag, storeRefreshTokenInS3 } from './user.model.ts';
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

    const { accessToken, refreshToken } = await handleTokenOperations(userInfo.userTag);

    const userTokenInfo: loginResDto = { userTag: userInfo.userTag, accessToken, refreshToken };
    return userTokenInfo;
};

export const refreshTokenService = async (userRefreshToken: refreshTokenDto) => {
    const { refreshToken, userTag } = userRefreshToken;

    const storedToken = await storeRefreshTokenInS3({ userTag, refreshToken });
    if (!storedToken || storedToken !== refreshToken) {
        throw new Error("Invalid refresh token");
    }
    return await handleTokenOperations(userTag);
};

const handleTokenOperations = async (userTag: string) => {
    const { accessToken, refreshToken } = generateTokens(userTag);
    const userRefreshToken = { userTag, refreshToken };

    // S3에 refreshToken 저장
    const storedToken = await storeRefreshTokenInS3(userRefreshToken);
    if (!storedToken || storedToken !== refreshToken) {
        throw new Error("Token storage failed or token mismatch");
    }

    return { accessToken, refreshToken };
};

// 로그아웃 (S3에서 토큰 삭제)
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

