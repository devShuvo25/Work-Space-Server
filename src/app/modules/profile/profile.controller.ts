import { Request, Response } from "express";
import { ProfileService } from "./profile.service";
import catchAsync from "../../utils/catchAsync"; 
import sendResponse from "../../utils/sendResponse"; 
import httpStatus from "http-status";

/**
 * Fetch the logged-in user's full profile data
 */
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id || req.user?.userId;

  const result = await ProfileService.getProfileData(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

/**
 * Update core user profile (Name, Bio, Profile Image)
 */
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.id || req?.user?.userId; 
  const data = req.body;

  // Cloudinary image handling for core profile
  if (req.file) {
    data.image = req.file.path;
  }

  const result = await ProfileService.updateProfile(userId, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

/**
 * Handle Add/Update/Delete for nested models (Portfolio, Education, etc.)
 * URL Pattern: /api/profile/manage/:model/:id?
 */
const manageProfileRelation = catchAsync(async (req: Request, res: Response) => {
  const { model, id } = req.params;
  const method = req.method;
  const data = req.body;

  // --- File Handling for Relations (Portfolio Cover, etc.) ---

  if (req.file) {
    data.imageUrl = req.file.path; 
  }

  const profileId = data.profileId;

  let result;

  switch (method) {
    case "POST":
      result = await ProfileService.addRelationItem(model, profileId, data);
      break;

    case "PATCH":
      if (!id) throw new Error("Item ID is required for updates");
      result = await ProfileService.updateRelationItem(model, id, data);
      break;

    case "DELETE":
      if (!id) throw new Error("Item ID is required for deletion");
      result = await ProfileService.deleteRelationItem(model, id);
      break;

    default:
      throw new Error("Method not supported");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${model.charAt(0).toUpperCase() + model.slice(1)} operation successful`,
    data: result,
  });
});

export const ProfileController = {
  getProfile,
  updateProfile,
  manageProfileRelation,
};