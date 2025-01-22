export class signoutResDto {
    userTag:string;
    success:boolean;

    constructor(userTag:string, success: boolean) {
        this.userTag = userTag
        this.success = success
    }
}