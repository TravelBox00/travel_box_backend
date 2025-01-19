import bcrypt from 'bcrypt';
import s3 from '../../configs/database/s3Connect.ts';
import { CustomError, errors } from '../../middlewares/error.middleware.ts';
import { signupReqDto } from '../dto/signup.dto.ts';
import { successResDto } from '../dto/succsee.dto.ts';
import { findUserTagByUserTag, userInfoDeleteByUserTag, userInfoRegisterByUserTag } from '../models/userSign.model.ts';

export const signupService = async (userInfo: signupReqDto): Promise<successResDto> => {
    const success = await userInfoRegisterByUserTag(userInfo)// 그냥 insert만 하고 중복확인 하는 로직을 따로 생성 -> 어처피 프론트에서 중복이면 x
    const successInfo: successResDto = {userTag: userInfo.userTag, success: success}
    return successInfo
};

export const duplicateService = async (userTag: string) => {
    findUserTagByUserTag(userTag)
    const successInfo: successResDto = {userTag: userTag, success: true}
    return successInfo
};

export const signoutService = async (userTag: string) => {
    userInfoDeleteByUserTag(userTag)
    const successInfo: successResDto = {userTag: userTag, success: true}
    return successInfo
};

/*
export const modifyService = async () => {
    userInfoChangeByUserTag()
    return
};
*/