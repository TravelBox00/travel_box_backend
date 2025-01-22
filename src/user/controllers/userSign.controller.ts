
import { Request, Response, NextFunction } from 'express';
import { CustomError, errors } from '../../middlewares/error.middleware.ts';
import { signupReqDto, signupResDto } from '../dto/signup.dto.ts';
import { duplicateService, signoutService, signupService } from '../services/userSign.service.ts';
import { signoutResDto } from '../dto/signout.dto.ts';
import { successResDto } from '../dto/succsee.dto.ts';

export const signupController = async (req:Request, res:Response): Promise<void> => {
    try{
        const signupReq: signupReqDto = new signupReqDto(req.body.userTag, req.body.userPassword, req.body.userNickname);
        await signupService(signupReq);
            res.status(200).json(null);
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
        res.status(200).json(duplicateRes);
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
        res.status(200).json(null);
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
