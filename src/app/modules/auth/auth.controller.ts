import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { io } from '../../../server';

/**
 * Handles direct user registration.
 * No longer needs a separate verifyOtp step.
 */
const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.register(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

/**
 * Handles standard user login.
 */
const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.login(req.body);
  setTimeout(() => {
      io.to(result.user.id).emit("new_notification", {
        title: "Welcome Back!",
        message: `Hello ${result.user.name}, you have successfully logged in.`,
        type: "LOGIN_SUCCESS",
        createdAt: new Date(),
      });
    }, 1000);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful',
    data: result,
  });
});
/**
 * Retrieves the logged-in user's profile data.
 * The 'id' comes from the decoded token attached by auth middleware.
 */
const getMe = catchAsync(async (req: Request, res: Response) => {
  // Extract user id from the request (attached by auth middleware)
  const userId = req.user?.id || req.user?.userId; 
  console.log("User :", req?.user)
  console.log(" is :", userId)
  const result = await AuthServices.getMe(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});
/**
 * Google login 
 */
const googleSignIn = catchAsync(async (req: Request, res: Response) => {
  const { code } = req.body; // Frontend থেকে আসা Authorization Code
  const result = await AuthServices.googleSignIn(code);

  // সকেট নোটিফিকেশন (আপনার স্টাইল অনুযায়ী)
  setTimeout(() => {
    io.to(result.user.id).emit("new_notification", {
      title: "Google Login Success",
      message: `Welcome ${result.user.name}! You have successfully logged in via Google.`,
      type: "LOGIN_SUCCESS",
      createdAt: new Date(),
    });
  }, 1000);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful with Google',
    data: result,
  });
});

export const AuthController = {
  register,
  login,
  getMe,
  googleSignIn 
};
