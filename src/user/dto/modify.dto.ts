export class modifyReqDto {
    userTag?: string;
    userPassword?: string;
    userNickname?: string;

    constructor(userTag?: string, userPassword?: string, userNickname?: string) {
        this.userTag = userTag;
        this.userPassword = userPassword;
        this.userNickname = userNickname;
    }
}

export class modifyResDto {
    userTag: string;
    success: boolean;

    constructor(userTag: string, success: boolean) {
        this.userTag = userTag;
        this.success = success;
    }
}
