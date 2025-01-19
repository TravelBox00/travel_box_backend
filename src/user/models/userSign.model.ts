import { pool } from "../../configs/database/mysqlConnect.ts"
import { signupReqDto } from "../dto/signup.dto.ts";

export const userInfoRegisterByUserTag = async (userInfo:signupReqDto) => {
    const {userTag, userPassword, userNickname} = userInfo
    const connection = await pool.getConnection();
    const query = `
        INSERT INTO User (userTag, userPassword, userNickname)
        VALUES (?, ?, ?)
        `
    const [rows]: any = await connection.execute(query, [userTag, userPassword, userNickname]);
    connection.release();
    return rows.affectedRows
};

export const findUserTagByUserTag = async (userTag:string):Promise<number> => {
    const connection = await pool.getConnection();
    console.log(userTag)
    const [[rows]]: any = await connection.execute(
       `
        SELECT COUNT(*) as count
        FROM User 
        WHERE userTag = ?
        `, [userTag]
    );
    connection.release();
    console.log(rows.count)
    return rows.count
};

export const userInfoDeleteByUserTag = async (userTag:string):Promise<number> => {
    
    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute(
        `
        DELETE FROM User
        WHERE userTag = ?
        `, [userTag]
    );
    connection.release();
    console.log(rows.affectedRows)
    return rows.affectedRows
};
/*
export const userInfoChangeByUserTag = async () => {
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
*/