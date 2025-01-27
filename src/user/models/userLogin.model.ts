import { pool } from "../../configs/database/mysqlConnect.ts"
import { refreshTokenDto} from '../dto/token.dto.ts';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from '../../configs/database/s3Connect.ts';
import { loginReqDto } from "../dto/login.dto.ts";
import { redisClient } from "../../configs/database/redisConnect.ts";

export const findUserByUserTag = async (userTag: string): Promise<loginReqDto | null> => {
    try{
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
    }catch(error){
        console.error(error)
        return null
    }
};

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
        
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const getRefreshTokenFromS3 = async (userTag: string): Promise<string | null> => {
    try {

        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: `tokens/${userTag}.json`
        };
        
        const command = new GetObjectCommand(params);
        const response = await s3.send(command);
        
        if (!response.Body) {
            return null
        }
        const body = await response.Body.transformToString();
        const parsedData = JSON.parse(body);
        return parsedData.refreshToken;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteRefreshTokenInS3 = async (userTag: string): Promise<boolean> => {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: `tokens/${userTag}.json`
        };

        const command = new DeleteObjectCommand(params);
        await s3.send(command); 
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const deleteRefreshTokenInRedis = async (userTag: string): Promise<number|undefined> => {
    try {
          const result = await redisClient.del(userTag);
          return result;
        } catch (error) {
          console.error(error);
        }
      
};

export const storeRefreshTokenInRedis = async (userRefreshToken: refreshTokenDto): Promise<void> => {
    try {
        const userTag = userRefreshToken.userTag;
        const refreshToken = userRefreshToken.refreshToken;

        await redisClient.set(userTag, refreshToken, 'EX', 3600);
        await redisClient.quit();
      } catch (error) {
        console.log(error)
        throw new Error()
      }
};

export const getRefreshTokenFromRedis = async (userTag: string): Promise<string|undefined|null> => {
    try {
        const refreshToken = await redisClient.get(userTag);
        await redisClient.quit();
        return refreshToken
    } catch (error) {
        console.error(error);
    }
};