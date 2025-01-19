import { loginReqDto, loginResDto } from "../dto/login.dto.ts"
import { logoutReqDto, logoutResDto } from "../dto/logout.dto.ts"
import { pool } from "../../configs/database/mysqlConnect.ts"
import { refreshTokenDto } from '../dto/refreshToken.dto.ts';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from '../../configs/database/s3Connect.ts';

export const findUserByUserTag = async (userTag: string) => {
    const connection = await pool.getConnection();
    const [[rows]]: any = await connection.execute(
        `
        SELECT userTag, userPassword
        FROM User
        WHERE userTag = ?
        `,
        [userTag]
    );
    connection.release();
    return rows
};

export const logoutModel = async (logoutUserInfo:logoutReqDto): Promise<logoutResDto> => {

        const logoutSuccessInfo: logoutResDto = {
            userTag:"1",
            success:true
        }
        return Promise.resolve(logoutSuccessInfo)
}


// S3에 리프레시 토큰 저장
export const storeRefreshTokenInS3 = async (userRefreshToken: refreshTokenDto): Promise<boolean> => {
    try {
        const userTag = userRefreshToken.userTag;
        const refreshToken = userRefreshToken.refreshToken;

        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: `tokens/${userTag}.json`,
            Body: JSON.stringify({ refreshToken }),
            ContentType: 'application/json'
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);
        
        return true;  // 저장한 refreshToken을 그대로 반환
    } catch (error) {
        console.error("Error uploading refresh token to S3:", error);
        throw new Error("Failed to store refresh token in S3");
    }
};

// S3에서 리프레시 토큰 가져오기
export const getRefreshTokenFromS3 = async (userTag: string): Promise<string | null> => {
    try {

        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: `tokens/${userTag}.json`
        };
        
        const command = new GetObjectCommand(params);
        const response = await s3.send(command);
        
        if (!response.Body) {
            throw new Error("Not Found refresh token in S3");
        }
        const body = await response.Body.transformToString();
        const parsedData = JSON.parse(body);
        return parsedData.refreshToken;
    } catch (error) {
        console.error("Error retrieving refresh token from S3:", error);
        return null;
    }
};

export const deleteRefreshTokenInS3 = async (userTag: string): Promise<boolean> => {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET,  // Ensure the same env var is used consistently
            Key: `tokens/${userTag}.json`
        };

        const command = new DeleteObjectCommand(params);
        await s3.send(command); 
        return true;
    } catch (error) {
        console.error("Failed to delete refresh token from S3:", error);
        return false;
    }
};

