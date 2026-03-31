import { z } from "zod";

/**
 * Enums matching your Prisma Schema for strict validation
 */
const UserStatusEnum = z.enum(['ACTIVE', 'SUSPENDED', 'DEACTIVATED']);
const UserRoleEnum = z.enum(['CLIENT', 'FREELANCER', 'ADMIN']);

/**
 * Validation for updating user profile data.
 * All fields are optional because a user might only change one thing (e.g., just their name).
 */
const updateUser = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email format").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    image: z.string().url("Invalid image URL").optional(),
  }),
});

/**
 * Validation for Administrative actions (Change status or Role)
 * This ensures an admin doesn't accidentally send an invalid status string.
 */
const updateUserStatus = z.object({
  body: z.object({
    status: UserStatusEnum,
  }),
});

const updateUserRole = z.object({
  body: z.object({
    role: UserRoleEnum,
  }),
});

export const userValidation = { 
  updateUser, 
  updateUserStatus, 
  updateUserRole 
};