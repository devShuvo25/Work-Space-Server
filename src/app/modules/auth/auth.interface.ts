import { UserRole } from '@prisma/client';

export interface IRegisterUser {
  name: string;      // Replaces firstName and lastName
  email: string;
  password: string;  // Usually required for registration
  role: UserRole;    // CLIENT | FREELANCER | ADMIN
}

export interface IVerifyOtp {
  email: string;
  otp: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};
export type IForgotPassword = {
  email: string;
};
export type IResetPassword = {
  email: string;
  otp: string;
  newPassword: string;
};
export type IUpdateProfile = {
  firstName?: string;
  lastName?: string;
  bio?: string;
  age?: number;
};
