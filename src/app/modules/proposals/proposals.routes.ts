import express from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProposalController } from './proposals.controller';
import { ProposalValidation } from './proposals.vallidation';

const router = express.Router();

/**
 * Get all proposals with filters and search
 * Accessible by: ADMIN
 */
router.get(
  '/',
  auth(UserRole.ADMIN),
  ProposalController.getAllProposals
);

/**
 * Get all proposals for a specific job
 * Accessible by: CLIENT (Job Owner), ADMIN
 */
router.get(
  '/job/:jobId',
  auth(UserRole.CLIENT,UserRole.FREELANCER, UserRole.ADMIN),
  ProposalController.getProposalsByJob
);

/**
 * Submit a new proposal for a job
 * Accessible by: FREELANCER only
 */
router.post(
  '/submit-proposal',
  auth(UserRole.FREELANCER),
  validateRequest(ProposalValidation.createProposalZodSchema),
  ProposalController.createProposal
);

/**
 * Update proposal status (Accept/Reject) or details
 * Accessible by: CLIENT (to Accept/Reject), FREELANCER (to edit their own), ADMIN
 */
router.patch(
  '/:id',
  auth(UserRole.FREELANCER, UserRole.ADMIN),
  validateRequest(ProposalValidation.updateProposalZodSchema),
  ProposalController.updateProposal
);

/**
 * Delete a proposal
 * Accessible by: FREELANCER (Owner), ADMIN
 */
router.delete(
  '/:id',
  auth(UserRole.FREELANCER, UserRole.ADMIN),
  ProposalController.deleteProposal
);

export const ProposalRoutes = router;