import { pool } from "../configs/database/mysqlConnect.ts";
import { Response } from "express";

export const userAddFollowModel = async (
    userTag: string,
    followTag: string
): Promise<any> => {
    console.log("userAddFollowModel Connected");

    try {
        const [userIdArray]: any = await pool.query(`SELECT userId FROM User WHERE userTag = ?`, [userTag]);

        if (userIdArray.length === 0) {
            throw new Error(`userTag '${userTag}' not found`);
        }

        const userId: number = userIdArray[0].userId;

        const [followIdArray]: any = await pool.query(`SELECT userId FROM User WHERE userTag = ?`, [followTag]);

        if (followIdArray.length === 0) {
            throw new Error(`followTag '${followTag}' not found`);
        }

        const followId: number = followIdArray[0].userId;

        // 이미 팔로우 중이면 취소 로직
        const [deleteResult]: any = await pool.query(`SELECT * FROM Follow WHERE followingUserId = ? AND followerUserId = ?`, [userId, followId]);

        if (deleteResult.length === 1) {
            await deleteFollowModel(userId, followId);  // 여기서 res를 넘기지 않습니다
            return { message: 'deleteFollowModel success' };  // 컨트롤러에서 응답을 처리
        }

        // 팔로우 추가 로직
        await pool.query(`INSERT INTO Follow (followingUserId, followerUserId) VALUES (?, ?)`, [followId, userId]);
        return { message: 'Follow added successfully' };

    } catch (error: any) {
        console.log(error);
        throw new Error(error.message || 'userAddFollowModel error');
    }
};


// 팔로우 취소 Model
export const deleteFollowModel = async (
    userId : number,
    followId : number
): Promise<any> => {
    console.log('deleteFollowModel Connected');

    try {
        await pool.query(`DELETE FROM Follow WHERE followingUserId = ? AND followerUserId = ?`, [userId, followId]);

    } catch(error : any) {
        console.log(error);
        throw new Error( error.message || 'deleteFollowModel error');
    }
};

// Follower LookUp Model
export const showFollowerModel = async (
    userTag : string
): Promise<any> => {
    console.log('showFollowerModel Connected');

    try {
        // userTag 디코딩 처리
        const decodedUserTag = decodeURIComponent(userTag);

        // userid 먼저 찾기
        const [userIdArray]: any = await pool.query(`SELECT userId FROM User WHERE userTag = ?`, [decodedUserTag]);

        if(userIdArray.length === 0) {
            return { message: `userAddFollowModel error: userTag '${decodedUserTag}' not found` };
        }

        const userId: number = userIdArray[0].userId;

        /* 
         * 내 팔로워 조회
         *   -> followingId로 내 id 조회 후 followedid 검색
         */

        const [followerIdArray]: any = await pool.query(`SELECT followerUserId FROM Follow WHERE followingUserId = ?`, [userId]);

        if(followerIdArray.length === 0) {
            return { followers : [] };
        }

        return { followers: followerIdArray };

    } catch(error : any) {
        console.log(error);
        throw new Error( error.message || 'showFollowerModel error');
    }
};


// Following Model
export const showFollowingModel = async (
    userTag : string
): Promise<any> => {
    console.log('showFollowingModel Connected');

    try {
        // userTag 디코딩 처리
        const decodedUserTag = decodeURIComponent(userTag);

        // userid 먼저 찾기
        const [userIdArray]: any = await pool.query(`SELECT userId FROM User WHERE userTag = ?`, [decodedUserTag]);

        if(userIdArray.length === 0) {
            return { message : `userAddFollowModel error: userTag '${decodedUserTag}' not found` };
        }

        const userId: number = userIdArray[0].userId;

        /* 
         * 내 팔로잉 조회
         *   -> followerId로 내 id조회 후 followingid 검색
         */

        const [followerIdArray]: any = await pool.query(`SELECT followingUserId FROM Follow WHERE followerUserId = ?`, [userId]);

        if(followerIdArray.length === 0) {
            return { followers : [] };
        }

        return { followers: followerIdArray };

    } catch(error : any) {
        console.log(error);
        return { message: 'showFollowingModel error' };
    }
};