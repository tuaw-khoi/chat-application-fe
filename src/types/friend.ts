// types/user.ts

import { Room } from "@/store/roomStore";

export type TFriend = {
  id: string;
  fullname: string;
  img: string;
  room: Room;
};
