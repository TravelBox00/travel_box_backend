export class searchResDto {
    threadId: number;
    postImageURL: string;
    postTitle:string;
    postDate: Date;
    
    constructor(threadId:number, postImageURL: string, postTitle:string, postDate: Date) {
        this.threadId = threadId
        this.postImageURL = postImageURL,
        this.postTitle = postTitle,
        this.postDate = postDate
    };
}
