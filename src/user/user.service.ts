import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import s3 from '../configs/database/s3Connect';

import { CustomError, errors } from '../middlewares/error.middleware';
import { generateTokens, storeRefreshTokenInS3 } from '../middlewares/auth.middleware';

import { findUserByUserTag } from './user.model';
import { loginReqDto, loginResDto } from "./dto/login.dto"
import { refreshTokenDto } from './dto/refreshToken.dto';
import { logoutReqDto, logoutResDto } from "./dto/logout.dto"

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
export const logoutService = async (userTag: string) => {
    
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: `tokens/${userTag}.json`
    };

    await s3.deleteObject(params).promise();
    
    return true;
};
