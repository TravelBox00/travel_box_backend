import { ErrorDTO } from "./dto/error.dto.ts";

export class CustomError extends Error {
  statusCode: number; // statusCode를 CustomError의 속성으로 추가
  code: number;
  description: string;
  path?: string;

  constructor(error: Omit<ErrorDTO, 'path'>) {
    super(error.description);

    this.statusCode = error.statusCode;
    this.code = error.code;
    this.description = error.description;
    this.path = CustomError.extractErrorPath();

    // Maintains proper stack trace for where the error was thrown
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  // 스택 추적 정보에서 경로 추출
  private static extractErrorPath(): string {
    const stackLines = new Error().stack?.split("\n") || [];
    const errorOrigin = stackLines[2]?.trim();
    const match = errorOrigin?.match(/\((.*):\d+:\d+\)/);

    return match ? match[1] : "Unknown location";
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
    description: "User with the given ID does not exist.",
  },
  INVALID_INPUT: {
    statusCode: 400,
    code: 2,
    description: "The input provided is not valid.",
  },
};
  