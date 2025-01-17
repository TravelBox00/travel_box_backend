import { loginReqDto, loginResDto } from "./dto/login.dto.ts"
import { logoutReqDto, logoutResDto } from "./dto/logout.dto.ts"
import { pool } from "../configs/database/mysqlConnect.ts"
import { refreshTokenDto } from '../user/dto/refreshToken.dto.ts';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import s3 from '../configs/database/s3Connect.ts';

const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
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
export const storeRefreshTokenInS3 = async (userRefreshToken: refreshTokenDto): Promise<string> => {
    try {// 여기에 일정 시간이후에 삭제되게 하면 됨
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




`
export const getUsers = async () => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("SELECT * FROM users");
        connection.release();
        return rows;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const createUser = async (username: string, email: string) => {
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            "INSERT INTO users (username, email) VALUES (?, ?)", 
            [username, email]
        );
        connection.release();
        return result;
    } catch (error) {
        console.error("Error inserting user:", error);
        throw error;
    }
};

export const updateUser = async (userId: number, newEmail: string) => {
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            "UPDATE users SET email = ? WHERE id = ?", 
            [newEmail, userId]
        );
        connection.release();
        return result;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const deleteUser = async (userId: number) => {
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            "DELETE FROM users WHERE id = ?", 
            [userId]
        );
        
        return result;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};
`

