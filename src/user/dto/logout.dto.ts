export class logoutReqDto {
    userTag:string;

    constructor(userTag: string) {
        this.userTag = userTag;
    }
}

export class logoutResDto {
    userTag:string;
    success:boolean;
    
    constructor(userTag: string, success: boolean) {
        this.userTag = userTag;
        this.success = success;
    }
}