import { TPost } from "./post";
import { TUser } from "./user";


export type TLike = {
  id: string;
  user: TUser;
  post: TPost;
  createdAt: Date;
}
