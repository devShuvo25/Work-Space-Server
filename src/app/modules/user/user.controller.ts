import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

/**
 * Get All Users (Admin view with pagination)
 */
const getAllUsers = catchAsync(async (req, res) => {
    // req.query থেকে searchTerm স্ট্রিং হিসেবে বের করে নিন
    const { searchTerm } = req.query; 
    const currentUserId = req.user.id;

    // Service-এ পাঠানোর সময় নিশ্চিত করুন আপনি শুধু string পাঠাচ্ছেন
    const result = await UserServices.getAllUsersFromDB(
        searchTerm as string, 
        currentUserId
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrieved successfully',
        data: result,
    });
});

/**
 * Get User By ID (Public Profile / Detailed View)
 */
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.getUserByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

/**
 * Update User & Profile (The "Me" or "Admin" update)
 * Handles flat fields and nested arrays (Education, Experience, etc.)
 */
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // 1. Parse the body (Next.js/React usually sends other data as a string in FormData)
  const data = req.body;
  console.log("data is :", data)

  // 2. If a file was uploaded, Multer-Cloudinary provides the URL in req.file.path
  if (req.file) {
    data.image = req.file.path; 
  }
  // console.log("file :", req?.file)

  // 3. Call your service with the new image URL
  const result = await UserServices.updateUserIntoDB(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});


export const UserController = {
  getAllUsers,
  getUserById,
  updateUser,
};