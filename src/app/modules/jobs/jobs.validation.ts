import { z } from 'zod';

const ExperienceLevel = z.enum(['ENTRY_LEVEL', 'INTERMEDIATE', 'EXPERT']);
const BudgetType = z.enum(['FIXED', 'HOURLY']);
const JobStatus = z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);

const createJobZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }),
    description: z.string({ required_error: "Description is required" }),
    budget: z.number({ required_error: "Budget is required" }),
    budgetType: BudgetType.optional(),
    category: z.string({ required_error: "Category is required" }),
    skillsRequired: z.array(z.string()),
    experienceLevel: ExperienceLevel,
  }),
});

const updateJobZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    budget: z.number().optional(),
    status: JobStatus.optional(),
    skillsRequired: z.array(z.string()).optional(),
  }),
});

export const JobValidation = {
  createJobZodSchema,
  updateJobZodSchema,
};