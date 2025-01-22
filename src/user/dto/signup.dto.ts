export class signupReqDto {
    userTag:string;
    userPassword:string;
    userNickname:string;

    constructor(userTag:string, userPassword:string, userNickname:string) {
        this.userTag = userTag
        this.userPassword = userPassword
        this.userNickname = userNickname
    }
}

export class signupResDto {
    userTag:string;
    success:boolean;

    constructor(userTag:string, success: boolean) {
        this.userTag = userTag
        this.success = success
    }
}
