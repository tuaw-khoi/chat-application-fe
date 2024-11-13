import { TLike } from "./like";
import { TUser } from "./user";

export type TComment = {
  id: string;
  content: string;
  author: TUser;
  createdAt: Date;
  likes?: TLike[];
  replies?: Comment[];
  parentCommentId?: string;
}

export type CreateCommentDto = {
  content: string;
  postId: string;
  parentCommentId?: string;
};

export type UpdateCommentDto = {
  content: string;
};
