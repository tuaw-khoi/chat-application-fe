// types/user.ts

export type TUser = {
  id?: string;
  username: string;
  fullname: string;
  email: string;
  password?: string;
  role?: string; // Có thể là 'ADMIN' hoặc 'USER'
  img?: string;
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
