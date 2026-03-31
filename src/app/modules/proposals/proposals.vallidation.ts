import { z } from 'zod';

/**
 * Zod schema to validate the creation of a new Proposal
 * Used in the POST route
 */
const createProposalZodSchema = z.object({
  body: z.object({
    coverLetter: z
      .string({
        required_error: 'Cover letter is required',
      })
      .min(50, { message: 'Cover letter must be at least 50 characters' }),

    bidAmount: z
      .number({
        required_error: 'Bid amount is required',
      })
      .positive({ message: 'Bid amount must be a positive number' }),

    deliveryTime: z
      .string({
        required_error: 'Delivery time is required',
      }),

    jobId: z
      .string({
        required_error: 'Job ID is required',
      })
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid MongoDB Job ID' }),

    // Note: freelancerId is usually extracted from the JWT token in the controller,
    // but if you pass it in the body, uncomment the line below:
    // freelancerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Freelancer ID'),
  }),
});

/**
 * Zod schema to validate proposal updates
 * Used in the PATCH route
 */
const updateProposalZodSchema = z.object({
  body: z.object({
    coverLetter: z.string().min(50).optional(),
    bidAmount: z.number().positive().optional(),
    deliveryTime: z.string().optional(),
    status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']).optional(),
  }),
});

export const ProposalValidation = {
  createProposalZodSchema,
  updateProposalZodSchema,
};