import bcrypt from 'bcrypt';
import s3 from '../../configs/database/s3Connect.ts';
import { CustomError, errors } from '../../middlewares/error.middleware.ts';
import { signupReqDto } from '../dto/signup.dto.ts';
import { successResDto } from '../dto/succsee.dto.ts';
import { findUserTagByUserTag, userInfoDeleteByUserTag, userInfoRegisterByUserTag } from '../models/userSign.model.ts';

export const signupService = async (userInfo: signupReqDto): Promise<boolean> => {
    const success = await userInfoRegisterByUserTag(userInfo)// 그냥 insert만 하고 중복확인 하는 로직을 따로 생성 -> 어처피 프론트에서 중복이면 x
    if(success == 1){
        return true
    }else{
        throw new Error("not register userInfo");
    }
};

export const duplicateService = async (userTag: string) => {
    let success = false
    const dupulicate: number = await findUserTagByUserTag(userTag)

    if(dupulicate == 1){
        success = true
    }
    return success
};

export const signoutService = async (userTag: string) => {
    let success = false
    const deleteUser: number = await userInfoDeleteByUserTag(userTag)
    if(deleteUser == 1){
        success = true
    }
    return success
};

/*
export const modifyService = async () => {
    userInfoChangeByUserTag()
    return
};
*/