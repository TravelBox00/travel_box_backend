export class searchResDto {
  userTag: string;

  threadId: number;

  imageURL: string;

  postTitle: string;

  postDate: Date;

  constructor(
    userTag: string,
    threadId: number,
    imageURL: string,
    postTitle: string,
    postDate: Date
  ) {
    this.userTag = userTag;
    this.threadId = threadId;
    (this.imageURL = imageURL),
      (this.postTitle = postTitle),
      (this.postDate = postDate);
  }
}
