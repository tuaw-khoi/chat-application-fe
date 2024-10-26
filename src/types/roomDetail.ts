// types/user.ts

import { TGroupRoom } from "./roomForUser";

export type TRoomDetail = {
  room: TGroupRoom;
  imageMessages: TImageMessages;
};

export type TImageMessages = {
  id: number;
  content: string;
  senderId: string | { id: string };
  roomId: number;
  type: string;
};
