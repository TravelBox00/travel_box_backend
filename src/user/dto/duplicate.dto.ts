export class duplicateResDto {
    userTag:string;
    success:boolean;

    constructor(userTag:string, success: boolean) {
        this.userTag = userTag
        this.success = success
    }
}
