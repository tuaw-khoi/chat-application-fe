// types/user.ts

export type TUser = {
  id: string;
  username: string;
  fullname: string;
  email: string;
  role: "ADMIN" | "USER";
  img: string;
  created_at: string;
  updated_at: string;
  roomUsers?: Array<{
    id: number;
    isAdmin: boolean;
    room?: {
      id: string;
      name: string;
      isPublic: boolean;
      createdAt: string;
      updatedAt: string;
      img: string;
    };
  }>;
};

export type TUserLogin = {
  emailorusername?: string;
  fullname: string;
};

export type TLoginResponse = {
  token: string;
  user: TUser;
};

export type TRegisterUser = {
  fullName: string;
  email: string;
  username: string;
  password: string;
};

export type TChangePassword = {
  userId: string;
  oldPassword: string;
  newPassword: string;
};
export type TAuthStore = {
  firebaseToken: string;
};
