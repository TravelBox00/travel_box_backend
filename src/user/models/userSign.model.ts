import { pool } from "../../configs/database/mysqlConnect.ts"
import { modifyResDto } from "../dto/modigy.dto.ts";
import { signupReqDto } from "../dto/signup.dto.ts";

export const userInfoRegisterByUserTag = async (userInfo:signupReqDto) => {
    const success = false
    const {userTag, userPassword, userNickname} = userInfo
    const connection = await pool.getConnection();
    const query = `
        INSERT INTO User (userPassword, userNickname, userTag)
        VALUES (?, ?, ?)
        `
    const [[rows]]: any = await connection.execute(query, [userTag, userPassword, userNickname]);
    connection.release();``
    
    
    return success
};

export const findUserTagByUserTag = async (userTag:string) => {
    const connection = await pool.getConnection();
    const [[rows]]: any = await connection.execute(
    );
    connection.release();

    return rows
};

export const userInfoDeleteByUserTag = async (userTag:string) => {
    const connection = await pool.getConnection();
    const [[rows]]: any = await connection.execute(
    );
    connection.release();

    return rows
};

export const userInfoChangeByUserTag = async (userInfo: modifyResDto) => {
    const connection = await pool.getConnection();
    const [[rows]]: any = await connection.execute(
    );
    connection.release();

    return rows
};
