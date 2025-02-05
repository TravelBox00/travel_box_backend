import { Response, Request, NextFunction } from "express";
import { showFollowerService, showFollowingService, userAddFollowService } from "./follow.service.ts";


export const userAddFollowController = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    console.log('userAddFollow Controller Connected');  

    try {
        const userTag = req.body.userTag as string;
        const followTag = req.body.followTag as string;

        const result = await userAddFollowService(userTag, followTag);

        return res.status(200).json(result);  // 응답은 여기서만 처리

    } catch (error : any) {
        console.log(error);
        return res.status(500).json({ message: 'userAddFollow Controller error' });  // 오류 응답
    }
};

// Follower 보기
export const showFollowerController = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    console.log('showFollower Controller Connected');

    try {
        const userTag = decodeURIComponent(req.params.userTag) as string;  // URL 디코딩 처리

        const result = await showFollowerService(userTag);

        return res.status(200).json(result);

    } catch(error : any) {
        console.log(error);
        return res.status(500).json({ message: 'Look UP Follower List Controller error' });
    }
};

// Following 보기
export const showFollowingController = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    console.log('showFollowing Controller Connected');

    try {
        const userTag = decodeURIComponent(req.params.userTag) as string;  // URL 디코딩 처리

        const result = await showFollowingService(userTag);

        return res.status(200).json(result);

    } catch(error : any) {
        console.log(error);
        return res.status(500).json({ message: 'Look UP Following List Controller error' });
    }
};