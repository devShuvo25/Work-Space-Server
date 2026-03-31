import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { JobController } from './jobs.controller';
import { JobValidation } from './jobs.validation';

const router = express.Router();

/**
 * Get all jobs with filters and search
 */
router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.FREELANCER, UserRole.CLIENT),
  JobController.getAllJobs
);

/**
 * ✅ এই রাউটটি অবশ্যই /:id এর উপরে থাকতে হবে
 * Get all jobs for the logged-in client
 */
router.get(
  '/my-jobs',
  auth(UserRole.CLIENT),
  JobController.getMyJobs
);

/**
 * ❌ এই রাউটটি নিচে থাকতে হবে
 * Get a single job detail
 */
router.get(
  '/:id',
  auth(UserRole.ADMIN, UserRole.FREELANCER, UserRole.CLIENT),
  JobController.getJobById
);

/**
 * Create a new job
 */
router.post(
  '/create-job',
  auth(UserRole.CLIENT),
  validateRequest(JobValidation.createJobZodSchema),
  JobController.createJob
);

/**
 * Update an existing job
 */
router.patch(
  '/:id',
  auth(UserRole.CLIENT, UserRole.ADMIN),
  validateRequest(JobValidation.updateJobZodSchema),
  JobController.updateJob
);

/**
 * Delete a job
 */
router.delete(
  '/:id',
  auth(UserRole.CLIENT, UserRole.ADMIN),
  JobController.deleteJob
);

export const JobRoutes = router;