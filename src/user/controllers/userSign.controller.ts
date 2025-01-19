import { Request, Response, NextFunction } from 'express';
import { CustomError, errors } from '../../middlewares/error.middleware.ts';
import { signupReqDto, signupResDto } from '../dto/signup.dto.ts';
import { duplicateService, signoutService, signupService } from '../services/userSign.service.ts';
import { duplicateResDto } from '../dto/duplicate.dto.ts';
import { signoutResDto } from '../dto/signout.dto.ts';
import { successResDto } from '../dto/succsee.dto.ts';

export const signupController = async (req:Request, res:Response) => {
    try{
        const signupReq: signupReqDto = new signupReqDto(req.body.userTag, req.body.userPassword, req.body.userNickname);
        const signupRes: boolean = await signupService(signupReq)
        res.status(200).json(signupRes);
    }catch(error){
        console.error(error)
        res.status(500).json(error);
    }
}

export const duplicateController =  async (req:Request, res:Response) => {
    try{
        const userTag: string = req.body.userTag
        const duplicateRes: boolean = await duplicateService(userTag)
        res.status(200).json(duplicateRes);
    }catch(error){
        console.error(error)
        res.status(500).json(error);
    }
}

export const signoutController = async (req: Request, res: Response) => {
    try {
        const userTag: string = req.params.userTag
        const signoutRes: boolean = await signoutService(userTag)
        res.status(200).json(signoutRes);
    } catch (error) {
        console.error(error)
        res.status(500).json(error);
    }
};
/*
export const modifyController = async (req: Request, res: Response) => {
    try {
        const modifyReq: modifyReqDto = new signupReqDto(req.body.userTag, req.body.userPassword, req.body.user. userNickname);
        const modifyRes: successResDto = signupService(modifyReq)
  
      res.status(200).send();
    } catch (error) {
  
    }
  };
  
*/