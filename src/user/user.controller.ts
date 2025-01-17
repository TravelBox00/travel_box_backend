import { Request, Response } from 'express';
import { CustomError, errors } from '../middlewares/error.middleware.ts';
import { loginReqDto, loginResDto } from "./dto/login.dto.ts"
import { logoutReqDto, logoutResDto } from "./dto/logout.dto.ts"
import {loginService, logoutService, refreshTokenService} from "./user.service.ts"
import { refreshTokenDto } from './dto/refreshToken.dto.ts';

export const loginController = async (req:Request, res:Response) => {
    try{
        const loginReq: loginReqDto = new loginReqDto(req.body.userTag, req.body.userPassword);
        const loginRes: loginResDto = await loginService(loginReq);
        
        res.status(200).json(loginRes);
    }catch(error){
        console.error(error)
        res.status(500).json(error);
    }
}

export const refreshTokenController = async (req: Request, res: Response) => {
    try {
        const refreshTokenReq: refreshTokenDto = new refreshTokenDto(req.body.userTag, req.body.refreshToken);
        const newAccessToken = await refreshTokenService(refreshTokenReq);

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error(error)
        res.status(401).json(error);
    }
};

export const logoutController = async (req:Request, res:Response) => {
    try{
        
        const logoutReq: logoutReqDto = new logoutReqDto(req.body.userTag);
        /*
        const logoutRes: logoutResDto = await logoutService(logoutReq);

        if(logoutRes.success){
            res.status(200).json(logoutRes)
        }
            */
    }catch(error){
        console.error(error)
        res.status(500).json(error);
   }
        
}
    