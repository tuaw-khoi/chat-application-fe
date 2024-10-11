// types/user.ts

export type TroomsForUser = {
  roomName: string;
  roomId: string;
  latestMessage: string;
};

export type TGroupRoom = {
  id: string;
  name: string;
  isPublic: string;
  img: string;
  createdAt: string;
  updatedAt: string;
  roomUsers: [];
};
