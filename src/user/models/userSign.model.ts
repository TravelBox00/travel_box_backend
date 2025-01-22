import { pool } from "../../configs/database/mysqlConnect.ts"
import { hashedSignupDto } from "../dto/signup.dto.ts";

export const userInfoRegisterByUserTag = async (userInfo: hashedSignupDto) => {
    try{
        const {userTag, hashedPassword, userNickname} = userInfo
        const connection = await pool.getConnection();
        const query = `
            INSERT INTO User (userTag, userPassword, userNickname)
            VALUES (?, ?, ?)
            `
        await connection.execute(query, [userTag, hashedPassword, userNickname]);
        connection.release();
    }catch(error){
        console.error(error)
        throw new Error();
    }
};

export const findUserTagByUserTag = async (userTag:string): Promise<number> => {
    try{
        const connection = await pool.getConnection();
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
    }catch(error){
        console.error(error)
        throw new Error();
    }
};

export const userInfoDeleteByUserTag = async (userTag:string): Promise<number> => {
    try{
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
    }catch(error){
        console.error(error)
        throw new Error
    }
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