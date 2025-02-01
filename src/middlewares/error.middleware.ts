import { NextFunction, Request, Response } from 'express';
import { ErrorDTO } from './dto/error.dto.ts';

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

export class CustomError extends Error {
  statusCode: number;

  code: number;

  description: string;

  path?: string;

  constructor(error: Omit<ErrorDTO, 'path'>, existingError: Error) {
    super(error.description);

    this.statusCode = error.statusCode;
    this.code = error.code;
    this.description = error.description;

    // 기존 에러 객체의 스택 사용
    this.stack = existingError.stack;

    // 스택 추적에서 CustomError 생성자 제외
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.path = this.extractErrorPath();

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  private extractErrorPath(): string {
    if (!this.stack) {
      return 'Unknown location';
    }

    const stackLines = this.stack.split('\n');
    const relevantLine = stackLines.find((line) => line.includes('at'));
    if (!relevantLine) return 'Unknown location';

    const match = relevantLine.match(/\((.*):\d+:\d+\)/);
    return match ? match[1] : 'Unknown location';
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      code: err.code,
      description: err.description,
      path: err.path,
    });
  } else {
    res.status(500).json({
      code: 500,
      description: 'Internal Server Error',
      path: req.path,
    });
  }
}

export const errors = {
  NOT_FOUND_USER_TAG: {
    statusCode: 404,
    code: 1,
    description: 'User ID does not exist.',
  },
  NOT_FOUND_WORD: {
    statusCode: 404,
    code: 2,
    description: "not found similar data.",
  },
  INVALID_PASSWORD: {
    statusCode: 401,
    code: 1,
    description: 'The password provided is incorrect.',
  },
  INVALID_TOKEN: {
    statusCode: 401,
    code: 2,
    description: 'The token provided is invalid or expired.',
  },
  NOT_INPUT_VALUE: {
    statusCode: 400,
    code: 1,
    description: 'Not provided value.',
  },
  INCORRECT_TYPE: {
    statusCode: 400,
    code: 2,
    description: 'Invalid value provided.',
  },
  INCORRECT_DATE: {
    statusCode: 422,
    code: 1,
    description: 'Invalid date format. Expected YYYY-MM-DD.',
  },
  INCORRECT_EMAIL: {
    statusCode: 422,
    code: 2,
    description:
      'Invalid email format. Expected something like user@example.com.',
  },
  INCORRECT_NICKNAME: {
    statusCode: 422,
    code: 3,
    description: 'Invalid nickname. Must be between 3 and 10 characters.',
  },
  INCORRECT_PASSWORD: {
    statusCode: 422,
    code: 4,
    description: 'Invalid password. Must be between 5 and 10 characters.',
  },
  NOT_PROVIDED_VALUES: {
    statusCode: 400,
    code: 1,
    description: 'threadId와 userId를 모두 제공해야 합니다.',
  },
  SERVER_ERROR: {
    statusCode: 500,
    code: 2,
    description: '서버 오류가 발생했습니다.',
  },
  TOGGLE_LIKE_ERROR: {
    statusCode: 500,
    code: 3,
    description: '좋아요 토글 중 오류가 발생했습니다.',
  },
  TOGGLE_SCRAP_ERROR: {
    statusCode: 500,
    code: 4,
    description: '스크랩 토글 중 오류가 발생했습니다.',
  },
};
