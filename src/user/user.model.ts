import { loginReqDto, loginResDto } from "./dto/login.dto.ts"
import { logoutReqDto, logoutResDto } from "./dto/logout.dto.ts"
import { pool } from "../configs/database/mysqlConnect.ts"

    
export const findUserByUserTag = async (userTag: string) => {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute(
        `
        SELECT id, userPassword
        FROM user
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

