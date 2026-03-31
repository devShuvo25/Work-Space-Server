import { z } from "zod";

// Helper to handle date strings from frontend forms
const dateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());

const portfolioSchema = z.object({
  profileId: z.string({ required_error: "Profile ID is required" }),
  title: z.string({ required_error: "Title is required" }),
  startingDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  description: z.string().optional(),
  link: z.string().url("Invalid URL format").optional().or(z.literal("")),
  imageUrl: z.string().optional(),
});

const educationSchema = z.object({
  profileId: z.string({ required_error: "Profile ID is required" }),
  institution: z.string({ required_error: "Institution is required" }),
  degree: z.string({ required_error: "Degree is required" }),
  fieldOfStudy: z.string().optional(),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
});

const experienceSchema = z.object({
  profileId: z.string({ required_error: "Profile ID is required" }),
  company: z.string({ required_error: "Company is required" }),
  position: z.string({ required_error: "Position is required" }),
  startDate: dateSchema,
  isCurrent :z.boolean(),
  endDate: dateSchema.optional(),
  description: z.string().optional(),
});

const certificationSchema = z.object({
  profileId: z.string({ required_error: "Profile ID is required" }),
  name: z.string({ required_error: "Certification name is required" }),
  issuingOrg: z.string({ required_error: "Issuing organization is required" }),
  issueDate: dateSchema.optional(),
  credentialId: z.string().optional(),
  media: z.string().optional(),
  image : z.string().optional()
});

const testimonialSchema = z.object({
  profileId: z.string({ required_error: "Profile ID is required" }),
  clientName: z.string({ required_error: "Client name is required" }),
  clientRole: z.string().optional(),
  content: z.string({ required_error: "Content is required" }).min(10, "Testimonial is too short"),
});

export const ProfileValidation = {
  createPortfolio: z.object({ body: portfolioSchema }),
  updatePortfolio: z.object({ body: portfolioSchema.partial() }),
  
  createEducation: z.object({ body: educationSchema }),
  updateEducation: z.object({ body: educationSchema.partial() }),
  
  createExperience: z.object({ body: experienceSchema }),
  updateExperience: z.object({ body: experienceSchema.partial() }),
  
  createCertification: z.object({ body: certificationSchema }),
  updateCertification: z.object({ body: certificationSchema.partial() }),
  
  createTestimonial: z.object({ body: testimonialSchema }),
  updateTestimonial: z.object({ body: testimonialSchema.partial() }),
};