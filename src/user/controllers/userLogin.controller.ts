import { Request, Response } from 'express';
import { CustomError } from '../../middlewares/error.middleware.ts';
import { loginReqDto } from "../dto/login.dto.ts"
import {loginService, logoutService, refreshTokenService} from "../services/userLogin.service.ts"
import { refreshTokenDto, tokensDto } from '../dto/token.dto.ts';

export const loginController = async (req:Request, res:Response): Promise<void> => {
    try{
        const loginReq: loginReqDto = new loginReqDto(req.body.userTag, req.body.userPassword);
        const loginRes: tokensDto = await loginService(loginReq);
        
        res.status(200).json(loginRes);
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
}

export const refreshTokenController = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshTokenReq: refreshTokenDto = new refreshTokenDto(req.body.userTag, req.body.refreshToken);
        const newAccessToken: tokensDto = await refreshTokenService(refreshTokenReq);

        res.status(200).json({ accessToken: newAccessToken });
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

export const logoutController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userTag:string = req.params.userTag
        console.log(req.params)
        const logoutRes: null = await logoutService(userTag); 

        res.status(200).json(logoutRes);
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
        
    