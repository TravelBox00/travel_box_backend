import { Request, Response, NextFunction } from "express";

// thread error handing
export const notFoundThread = (err : Error, res: Response) => {
    console.error(err.stack); // Server Error Log
    res.status(404).json({
        success: false,
        message: "Thread Not Found",
    });
};

// user not exsist
export const notFoundUser = (err : Error, res: Response) => {
    console.error(err.stack); // Server Error Log
    res.status(404).json({
        success: false,
        message: "User Not Found",
    });
};

// 이미지 not fund
export const notFoundImage = (err : Error, res: Response) => {
    console.error(err.stack); // Server Error Log
    res.status(404).json({
        success: false,
        message: "Image Not Found",
    });
};

// 버켓 not found
export const notFoundBucket = (err : Error, res: Response) => {
    console.error(err.stack); // Server Error Log
    res.status(404).json({
        success: false,
        message: "Bucket Not Found",
    });
};