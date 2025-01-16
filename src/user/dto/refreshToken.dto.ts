export class refreshTokenDto {
    userTag:string;
    refreshToken:string;

    constructor(userTag: string, refreshToken:string) {
        this.userTag = userTag;
        this.refreshToken = refreshToken;
    }
}
