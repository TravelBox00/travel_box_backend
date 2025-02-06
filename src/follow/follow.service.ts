import { Response } from 'express';
import { showFollowerModel, showFollowingModel, userAddFollowModel } from './follow.model.ts';

export const userAddFollowService = async (
    userTag : string,
    followTag : string
): Promise<any> => {
    console.log('userAddFollowService Connected');

    const result = userAddFollowModel(userTag, followTag);

    return result;
};

export const showFollowerService = async (
    userTag : string
): Promise<any> => {
    console.log('showFollowerService Connected');

    const result = showFollowerModel(userTag);

    return result;
};

// Following 보기
export const showFollowingService = async (
    userTag : string
): Promise<any> => {
    console.log('showFollowingService Connected');

    const result = showFollowingModel(userTag);

    return result;
};