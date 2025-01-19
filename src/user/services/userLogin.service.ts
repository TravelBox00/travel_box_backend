import bcrypt from 'bcrypt';

import s3 from '../../configs/database/s3Connect.ts';
import { CustomError, errors } from '../../middlewares/error.middleware.ts';
import { generateTokens } from '../../middlewares/auth.middleware.ts';

import { findUserByUserTag, getRefreshTokenFromS3, storeRefreshTokenInS3, deleteRefreshTokenInS3 } from '../models/userLogin.model.ts';
import { loginReqDto, loginResDto } from "../dto/login.dto.ts"
import { refreshTokenDto } from '../dto/refreshToken.dto.ts';
import { logoutReqDto, logoutResDto } from "../dto/logout.dto.ts"

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

export const refreshTokenService = async (userRefreshToken: refreshTokenDto): Promise<loginResDto> => {
    const { refreshToken, userTag } = userRefreshToken;
    const storedToken = await getRefreshTokenFromS3(userTag);
    
    if (!storedToken || storedToken !== refreshToken) {
        throw new Error("Invalid refresh token");
    }
    const tokens = await handleTokenOperations(userTag);
    const userTokenInfo: loginResDto = {
        userTag, 
        accessToken: tokens.accessToken, 
        refreshToken: tokens.refreshToken
    };

    return userTokenInfo;
};

const handleTokenOperations = async (userTag: string) => {
    const { accessToken, refreshToken } = generateTokens(userTag);
    const userRefreshToken = { userTag, refreshToken };

    // S3에 refreshToken 저장
    const success = await storeRefreshTokenInS3(userRefreshToken);
    if(success == true){
        return { accessToken, refreshToken };
    }else{
        throw new Error("Token storage failed or token mismatch");
    }        
};

// 로그아웃 (S3에서 토큰 삭제)
export const logoutService = async (userTag: string): Promise<null> => {
    const success = await deleteRefreshTokenInS3(userTag)
    if(success == true){
        return null;
    }else{
        throw new Error("Token delete failed");
    }  
};

