
export interface userPostDTO {
  postCategory: string;
  postTitle: string;
  postContent: string;
  postDate: Date;
  clothId: number;
};

export interface updatePostDTO { 
  postCategory: string;
  postTitle: string;
  postContent: string;
};