import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { signupReqDto } from '../dto/signup.dto.ts';
import { findUserTagByUserTag, userInfoDeleteByUserTag, userInfoRegisterByUserTag } from '../models/userSign.model.ts';
import { CustomError, errors } from '../../middlewares/error.middleware.ts';
import { checkNickname, checkPassword, checkRequired } from '../utils/loginValidate.ts';

export const signupService = async (userInfo: signupReqDto) => {
    const {userTag, userPassword, userNickname} = userInfo
    await checkRequired(userInfo)
    await checkNickname(userNickname)
    await checkPassword(userPassword)
    const firstHash = crypto.createHash('sha256').update(userPassword).digest('hex');
    const hashedPassword: string = await bcrypt.hash(firstHash, 10);
    await userInfoRegisterByUserTag({userTag, hashedPassword, userNickname })
};  

export const duplicateService = async (userTag: string) => {
    let duplicate = false
    const CheckUserTag: number = await findUserTagByUserTag(userTag)

    if(CheckUserTag == 1){
        duplicate = true
    }
    return duplicate
};

export const signoutService = async (userTag: string) => {
    const deleteCount:number = await userInfoDeleteByUserTag(userTag)
    if(deleteCount != 1){
        throw new CustomError(errors.NOT_FOUND_USER_TAG);
    }
};