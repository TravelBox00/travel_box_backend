import { pool } from '../../configs/database/mysqlConnect.ts';
import { hashedSignupDto } from '../dto/signup.dto.ts';

export const userInfoRegisterByUserTag = async (userInfo: hashedSignupDto) => {
  try {
    const { userTag, hashedPassword, userNickname, userProfileImage, email } =
      userInfo;
    const connection = await pool.getConnection();
    const query = `
            INSERT INTO User (userTag, userPassword, userNickname, userProfileImage, email)
            VALUES (?, ?, ?)
            `;
    await connection.execute(query, [
      userTag,
      hashedPassword,
      userNickname,
      userProfileImage,
      email,
    ]);
    connection.release();
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

export const findUserTagByUserTag = async (
  userTag: string
): Promise<number> => {
  try {
    const connection = await pool.getConnection();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [[rows]]: any = await connection.execute(
      `
            SELECT COUNT(*) as count
            FROM User 
            WHERE userTag = ?
            `,
      [userTag]
    );
    connection.release();
    return rows.count;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

export const userInfoDeleteByUserTag = async (
  userTag: string
): Promise<number> => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    await connection.beginTransaction();

    // 게시물 및 관련 데이터 삭제 (이미지, 해시태그)
    await connection.query(
      `
            DELETE Image, HashTag, TravelThread 
            FROM TravelThread
            LEFT JOIN Image ON Image.threadId = TravelThread.threadId
            LEFT JOIN HashTag ON HashTag.threadId = TravelThread.threadId
            WHERE TravelThread.userId = (SELECT userId FROM User WHERE userTag = ?)
        `,
      [userTag]
    );

    // 팔로우 관계 삭제 (내가 팔로우한 것, 나를 팔로우한 것)
    await connection.query(
      `
            DELETE FROM Follow 
            WHERE userId = (SELECT userId FROM User WHERE userTag = ?)
            OR followingUserId = (SELECT userId FROM User WHERE userTag = ?)
            OR followerUserId = (SELECT userId FROM User WHERE userTag = ?)
        `,
      [userTag, userTag, userTag]
    );

    // 댓글 및 좋아요 익명화 (NULL로 변경)
    await connection.query(
      `UPDATE Comment SET userId = NULL WHERE userId = (SELECT userId FROM User WHERE userTag = ?)`,
      [userTag]
    );
    await connection.query(
      `UPDATE \`Like\` SET userId = NULL WHERE userId = (SELECT userId FROM User WHERE userTag = ?)`,
      [userTag]
    );

    // 사용자 삭제 (마지막에 수행)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [deleteUser]: any = await connection.query(
      `DELETE FROM User WHERE userTag = ?`,
      [userTag]
    );

    await connection.commit();

    return deleteUser.affectedRows; // 삭제된 사용자 수 반환 (0 또는 1)
  } catch (error) {
    await connection.rollback();
    console.error(error);
    throw new Error();
  }
};

export const userInfoChangeByUserTag = async (
  userTag: string,
  hashedPassword?: string,
  userNickname?: string
) => {
  try {
    const connection = await pool.getConnection();
    const updates = [];
    const params = [];

    if (hashedPassword !== undefined) {
      updates.push('userPassword = ?');
      params.push(hashedPassword);
    }
    if (userNickname !== undefined) {
      updates.push('userNickname = ?');
      params.push(userNickname);
    }
    params.push(userTag);
    const query = `
            UPDATE User SET 
            ${updates.join(', ')}
            WHERE userTag = ?
            `;
    await connection.query(query, params);
    connection.release();
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};
