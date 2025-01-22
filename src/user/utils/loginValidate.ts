import { CustomError, errors } from "../../middlewares/error.middleware";

export const checkRequired = (value: any) => {
  if (value === undefined || value === null || value === "") {
    throw new CustomError(errors.NOT_INPUT_VALUE);
  }
}
export const checkType = (value: any, expectedType: string) => {
  if (typeof value !== expectedType) {
    throw new CustomError(errors.INCORRECT_TYPE);
  }
}

export const checkDate = (value: string) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}.\d{3}Z)?$/;// 2020-01-01
  if (!dateRegex.test(value) || isNaN(Date.parse(value))) {
    throw new CustomError(errors.INCORRECT_DATE);
  }
}

export const checkEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw new CustomError(errors.INCORRECT_EMAIL);
  }
}

export const checkNickname = (value: string) => {
  const nameRegex = /^.{3,10}$/;
  if (!nameRegex.test(value)) {
    throw new CustomError(errors.INCORRECT_NICKNAME);
  }
}

export const checkPassword = (value: string) => {
  const nameRegex = /^.{5,10}$/;
  if (!nameRegex.test(value)) {
    throw new CustomError(errors.INCORRECT_NICKNAME);
  }
}