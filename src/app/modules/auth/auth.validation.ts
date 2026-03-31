import { z } from 'zod';

// Matches UserRole enum in Prisma
const UserRoleEnum = z.enum(['CLIENT', 'FREELANCER', 'ADMIN']);

export const registerSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required"
    }).min(2, "Name must be at least 2 characters"),
    email: z.string({
      required_error: "Email is required"
    }).email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: UserRoleEnum.default('FREELANCER'), // Default to Freelancer
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required!',
    }).email('Invalid email format!'),
    password: z.string({
      required_error: 'Password is required!',
    }),
  }),
});


const resetPasswordValidation = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters long'),
  }),
});

export const authValidation = {
  registerSchema,
  resetPasswordValidation,
};