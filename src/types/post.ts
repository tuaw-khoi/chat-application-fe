import { TComment } from "./comment";
import { TLike } from "./like";
import { TUser } from "./user";

export type TPost = {
  id: string;
  content: string;
  author: TUser;
  createdAt: Date;
  updatedAt: Date;
  photos?: string[];
  likes?: TLike[];
  comments?: TComment[];
  isPublic: boolean;
}
