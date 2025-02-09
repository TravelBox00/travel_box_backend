/* eslint-disable eqeqeq */
import crypto from 'crypto';
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcrypt';

import { signupReqDto } from '../dto/signup.dto.ts';
import {
  findUserTagByUserTag,
  userInfoChangeByUserTag,
  userInfoDeleteByUserTag,
  userInfoRegisterByUserTag,
} from '../models/userSign.model.ts';
import { CustomError, errors } from '../../middlewares/error.middleware.ts';
import modifyReqDto from '../dto/modify.dto.ts';
import { checkNickname, checkPassword } from '../utils/loginValidate.ts';
import { deleteRefreshTokenInRedis } from '../models/userLogin.model.ts';

export const signupService = async (userInfo: signupReqDto) => {
  const { userTag, userPassword, userNickname } = userInfo;
  await checkNickname(userNickname);
  await checkPassword(userPassword);
  const salt: string = await bcrypt.genSalt(10);
  const firstHash: string = crypto
    .createHash('blake2b512')
    .update(userPassword)
    .digest('hex');
  const hashedPassword: string = await bcrypt.hash(firstHash, salt);
  await userInfoRegisterByUserTag({ userTag, hashedPassword, userNickname });
};

export const duplicateService = async (userTag: string) => {
  let duplicate = false;
  const CheckUserTag: number = await findUserTagByUserTag(userTag);

  // eslint-disable-next-line eqeqeq
  if (CheckUserTag == 1) {
    duplicate = true;
  }
  return duplicate;
};

export const signoutService = async (userTag: string) => {
  const deleteCount: number = await userInfoDeleteByUserTag(userTag);
  const success = await deleteRefreshTokenInRedis(userTag);
  if (deleteCount == 0 || success == 0) {
    throw new CustomError(errors.NOT_FOUND_USER_TAG, new Error());
  }
};

export const modifyService = async (userInfo: modifyReqDto) => {
  const { userTag, userPassword, userNickname } = userInfo;
  const user = await findUserTagByUserTag(userTag);
  let hashedPassword: string | undefined;
  if (!user) {
    throw new CustomError(errors.NOT_FOUND_USER_TAG, new Error());
  }

  if (userPassword) {
    await checkPassword(userPassword);
    const firstHash: string = crypto
      .createHash('blake2b512')
      .update(userPassword)
      .digest('hex');
    hashedPassword = await bcrypt.hash(firstHash, 10);
  }

  if (userNickname) {
    await checkNickname(userNickname);
  }
  if (!userPassword && !userNickname) {
    throw new CustomError(errors.NOT_INPUT_VALUE, new Error());
  }
  await userInfoChangeByUserTag(
    userTag,
    hashedPassword || undefined,
    userNickname || undefined
  );
};
