
import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../middlewares/error.middleware.ts';
import { signupReqDto } from '../dto/signup.dto.ts';
import { duplicateService, signoutService, signupService, modifyService } from '../services/userSign.service.ts';
import { modifyReqDto } from '../dto/modify.dto.ts';

export const signupController = async (req:Request, res:Response): Promise<void> => {
    try{
        const signupReq: signupReqDto = req.body;
        await signupService(signupReq);
        res.status(200).json({ isSuccess: true });
    }catch (error) {
        if (error instanceof CustomError) {
          res.status(error.statusCode).json({
            code: error.code,
            description: error.description,
            path: error.path
          });
          console.error(error)
        } else {
          res.status(500).send('Internal Server Error');
        }
    }
};

export const duplicateController =  async (req:Request, res:Response): Promise<void> => {
    try{
        const userTag: string = req.params.userTag
        const duplicateRes: boolean = await duplicateService(userTag)
        res.status(200).json({ result: duplicateRes, isSuccess: true });
    }catch (error) {
        if (error instanceof CustomError) {
          res.status(error.statusCode).json({
            code: error.code,
            description: error.description,
            path: error.path
          });
          console.error(error)
        } else {
          res.status(500).send('Internal Server Error');
        }
    }
};

export const signoutController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userTag: string = req.params.userTag
        await signoutService(userTag);
        res.status(200).json({isSuccess: true});
    }catch (error) {
        if (error instanceof CustomError) {
          res.status(error.statusCode).json({
            code: error.code,
            description: error.description,
            path: error.path
          });
          console.error(error)
        } else {
          res.status(500).send('Internal Server Error');
        }
    }
};

export const modifyController = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
  try {
    const userInfo: modifyReqDto = req.body;
      await modifyService(userInfo);
      res.status(200).json({isSuccess: true});
  }catch (error) {
      next(error);
  }
};