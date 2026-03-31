import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync'; // Path based on your snippet
import sendResponse from '../../utils/sendResponse'; // Path based on your snippet
import { ProposalService } from './proposals.service';
import { io } from '../../../server';
import app from '../../../app';
import AppError from '../../errors/AppError';
import { error } from 'console';
import { NotificationService } from '../notification/notification.service';

/**
 * Handles proposal submission.
 * freelancerId is extracted from the authenticated user's token.
 */
const createProposal = catchAsync(async (req: Request, res: Response) => {
  // Use user id from auth middleware
  const userId = req.user?.id || req.user?.userId;

  const result = await ProposalService.createProposal({
    ...req.body,
    freelancerId: userId,
  });
  
  // send notificatioion to client
  if (result && result.job) {
    const clientId = result.job.clientId;
    if (!clientId) {
      throw new Error('Clent id not found');
    }
    const freelancerName = result.freelancer.name;
    const notificationData = {
    recipientId: clientId,
    senderId: result.freelancerId,
    title: "New Proposal Received!",
    message: `${freelancerName} submitted a bid for '${result.job.title}'`,
    type: "PROPOSAL",
  };

  // 2. Save to MongoDB
  await NotificationService.createNotification(notificationData);
    io.to(clientId.toString()).emit('new_notification', {
      title: 'New Proposal Received!',
      message: `${freelancerName} has submitted a bid for your project: '${result.job.title}'.`,
      type: 'PROPOSAL',
      metadata: {
        proposalId: result.id,
        jobId: result.jobId,
      },
      createdAt: new Date(),
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Proposal submitted successfully',
    data: result,
  });
});

/**
 * Retrieves all proposals with advanced search, status filtering, and pagination.
 * The search term covers Freelancer Name, Job Title, and Job Category.
 */
const getAllProposals = catchAsync(async (req: Request, res: Response) => {
  // Extract query parameters for filtering and searching
  const filters = {
    searchTerm: req.query.searchTerm as string | undefined,
    status: req.query.status as string | undefined,
  };

  // Extract pagination options from query
  const paginationOptions = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  };

  // Call the service with filters and pagination
  const result = await ProposalService.getAllProposals(
    filters,
    paginationOptions,
  );

  // Send consistent response with metadata
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Proposals fetched successfully',
    meta: result.meta, // Includes total, page, limit, totalPages
    data: result.data, // The array of proposal records
  });
});
/**
 * Retrieves proposals for a specific job with pagination metadata.
 */
const getProposalsByJob = catchAsync(async (req: Request, res: Response) => {
  const { jobId } = req.params;

  // Extract pagination options from query string
  const paginationOptions = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  };

  const result = await ProposalService.getProposalsByJob(
    jobId,
    paginationOptions,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job proposals retrieved successfully',
    meta: result.meta, // Contains page, limit, total, totalPages
    data: result.data, // The array of proposals
  });
});

/**
 * Updates an existing proposal (e.g., changing status to ACCEPTED/REJECTED).
 */
const updateProposal = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProposalService.updateProposal(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Proposal updated successfully',
    data: result,
  });
});

/**
 * Deletes a proposal.
 */
const deleteProposal = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProposalService.deleteProposal(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Proposal deleted successfully',
    data: result,
  });
});

export const ProposalController = {
  createProposal,
  getAllProposals,
  getProposalsByJob,
  updateProposal,
  deleteProposal,
};
