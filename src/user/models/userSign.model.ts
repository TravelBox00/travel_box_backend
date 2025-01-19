import { pool } from "../../configs/database/mysqlConnect.ts"
import { modifyResDto } from "../dto/modigy.dto.ts";
import { signupReqDto } from "../dto/signup.dto.ts";

export const userInfoRegisterByUserTag = async (userInfo:signupReqDto) => {
    let success = false
    const {userTag, userPassword, userNickname} = userInfo
    const connection = await pool.getConnection();
    const query = `
        INSERT INTO User (userPassword, userNickname, userTag)
        VALUES (?, ?, ?)
        `

    const [[rows]]: any = await connection.execute(query, [userTag, userPassword, userNickname]);
    connection.release();
    
    console.log("affectedRows", rows.affectedRows);
    if (rows.affectedRows == 1){
        success = true;
    }
    
    return success
};

export const findUserTagByUserTag = async (userTag:string) => {
    const connection = await pool.getConnection();
    const [[rows]]: any = await connection.execute(
        `
        INSERT INTO User (userPassword, userNickname, userTag)
        VALUES (?, ?, ?)
        `
    );
    connection.release();

    return rows
};

export const userInfoDeleteByUserTag = async (userTag:string) => {
    const connection = await pool.getConnection();
    const [[rows]]: any = await connection.execute(
        `
        INSERT INTO User (userPassword, userNickname, userTag)
        VALUES (?, ?, ?)
        `
    );
    connection.release();

    return rows
};

export const userInfoChangeByUserTag = async (userInfo: modifyResDto) => {
    const connection = await pool.getConnection();
    const [[rows]]: any = await connection.execute(
        `
        INSERT INTO User (userPassword, userNickname, userTag)
        VALUES (?, ?, ?)
        `
    );
    connection.release();

    return rows
};
