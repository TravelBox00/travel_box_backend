export class loginReqDto {
    userTag:string;
    userPassword:string;

    constructor(userTag: string, userPassword: string) {
        this.userTag = userTag;
        this.userPassword = userPassword;
    }
}

export class loginResDto {
    userTag:string;
    accessToken:string;
    refreshToken:string;

    constructor(userTag: string, accessToken: string, refreshToken:string) {
        this.userTag = userTag;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}