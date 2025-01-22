import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { signupReqDto } from '../dto/signup.dto.ts';
import { findUserTagByUserTag, userInfoChangeByUserTag, userInfoDeleteByUserTag, userInfoRegisterByUserTag } from '../models/userSign.model.ts';
import { CustomError, errors } from '../../middlewares/error.middleware.ts';
import { modifyReqDto } from '../dto/modify.dto.ts';
import { findUserByUserTag } from '../models/userLogin.model.ts';

export const signupService = async (userInfo: signupReqDto) => {
    const {userTag, userPassword, userNickname} = userInfo
    // validation 로직 있으면 추가하기
    const hashedPassword: string = await bcrypt.hash(userPassword, 10);
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

export const modifyService = async (userInfo:modifyReqDto) => {
    const {userTag, userPassword, userNickname} = userInfo
    const user = await findUserByUserTag(userTag)
    let hashedPassword: string | undefined;
    if(!user){throw new CustomError(errors.NOT_FOUND_USER_TAG)}

    if (userPassword) {
        //await checkPassword(userPassword)
        const firstHash:string = crypto.createHash('sha256').update(userPassword).digest('hex');
        hashedPassword = await bcrypt.hash(firstHash, 10);
    }

    if (userNickname) {
        //await checkNickname(userNickname)
    }
    if(!userPassword && !userNickname){
        throw new CustomError(errors.NOT_INPUT_VALUE)
    }
    await userInfoChangeByUserTag(userTag, hashedPassword || undefined, userNickname || undefined)
};