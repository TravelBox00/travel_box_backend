import { NextFunction, Request, Response } from 'express';
import { signupReqDto } from '../dto/signup.dto.ts';
import {
  duplicateService,
  signoutService,
  signupService,
  modifyService,
} from '../services/userSign.service.ts';
import modifyReqDto from '../dto/modify.dto.ts';
import { decodeTokenUserTag } from '../../middlewares/auth.middleware.ts';

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const signupReq: signupReqDto = req.body;
    await signupService(signupReq);
    res.status(200).json({ isSuccess: true });
  } catch (error) {
    next(error);
  }
};

export const duplicateController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userTag } = req.params;
    const duplicateRes: boolean = await duplicateService(userTag);
    res.status(200).json({ result: duplicateRes, isSuccess: true });
  } catch (error) {
    next(error);
  }
};

export const signoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1] as string;
    const userTag: string = decodeTokenUserTag(token) as string;
    await signoutService(userTag);
    res.status(200).json({ isSuccess: true });
  } catch (error) {
    next(error);
  }
};

export const modifyController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userInfo: modifyReqDto = req.body;
    await modifyService(userInfo);
    res.status(200).json({ isSuccess: true });
  } catch (error) {
    next(error);
  }
};
