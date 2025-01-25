import { NextFunction, Request, Response } from 'express';
import { ErrorDTO } from './dto/error.dto.ts';

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

// 아래와 같이 정의하고 사용 가능
/*
{
  "statusCode": 404,// http-statusCode
  "code": 1,// 동일 statusCode에서 상황별 코드
  "description": "User with the given ID does not exist.",// 디테일한 설명
  "path": "/custom/api/endpoint"// 에러 발생 위치
}

import {CustomError, errors} from " ";

const error = new CustomError(errors.NOT_FOUND);

console.error(error);// 콘솔에 에러 출력
return res.status(error.statusCode).json(error);// error 객체 그대로 사용하여 응답
*/
export const errors = {
  NOT_FOUND_USER_TAG: {
    statusCode: 404,
    code: 1,
    description: 'User ID does not exist.',
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
};
