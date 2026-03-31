import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { JobService } from './jobs.service';

/**
 * Handles job creation.
 * clientId is extracted from the authenticated user's token.
 */
const createJob = catchAsync(async (req: Request, res: Response) => {
  // Use user id from auth middleware
  const userId = req.user?.id || req.user?.userId;
  
  const result = await JobService.createJob({
    ...req.body,
    clientId: userId,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Job created successfully',
    data: result,
  });
});

/**
 * Retrieves all jobs with search, filtering, and pagination.
 * Satisfies TResponse<Job[]> with TMeta.
 */
const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  // Extract query parameters for filtering
  const filters = {
    searchTerm: req.query.searchTerm as string | undefined,
    category: req.query.category as string | undefined,
    experienceLevel: req.query.experienceLevel as string | undefined,
    createdAt: req.query.createdAt as string | undefined,
  };

  // Extract pagination options
  const paginationOptions = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  };

  const result = await JobService.getAllJobs(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jobs fetched successfully',
    meta: result.meta, // Correctly mapping result.meta (limit, page, total, totalPages)
    data: result.data, // Accessing data array from service result
  });
});
const getMyJobs = catchAsync(async (req: Request, res: Response) => {
  // Auth middleware থেকে userId নেওয়া হচ্ছে
  const userId = req.user?.id || req.user?.userId;

  const result = await JobService.getMyJobs(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My jobs retrieved successfully',
    data: result,
  });
});
/**
 * Retrieves a specific job by its unique ID.
 */
const getJobById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await JobService.getJobById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job retrieved successfully',
    data: result,
  });
});
/**
 * Retrieves all jobs posted by the authenticated client.
 */



/**
 * Updates an existing job's information.
 */
const updateJob = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await JobService.updateJob(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job updated successfully',
    data: result,
  });
});

/**
 * Deletes a job from the database.
 */
const deleteJob = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await JobService.deleteJob(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job deleted successfully',
    data: result,
  });
});

export const JobController = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs
};