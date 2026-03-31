import { Proposal, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Create a new proposal for a specific job
 * @param data - The proposal data including jobId and freelancerId
 * @returns The created proposal
 */
const createProposal = async (data: Proposal): Promise<any> => {
  // Check if the freelancer has already submitted a proposal for this job
  const existingProposal = await prisma.proposal.findFirst({
    where: {
      jobId: data.jobId,
      freelancerId: data.freelancerId,
    },
  });

  if (existingProposal) {
    throw new Error('You have already submitted a proposal for this job.');
  }

  const result = await prisma.proposal.create({
    data,
    include: {
      job: true,
      freelancer: true,
    },
  });
  return result;
};

/**
 * Retrieves all proposals with filtering, searching, and pagination.
 * @param filters - Search and status filters
 * @param options - Pagination options (page, limit)
 */
const getAllProposals = async (
  filters: { searchTerm?: string; status?: string },
  options: { page: number; limit: number }
) => {
  const { page, limit } = options;
  const { searchTerm, status } = filters;
  const skip = (page - 1) * limit;

  // Build the "where" conditions dynamically
  const whereConditions: any = {};

  // Filter by status if provided
  if (status) {
    whereConditions.status = status;
  }

  // Search in coverLetter or Job Title if searchTerm exists
// Search in coverLetter, Job Title, or Job Category if searchTerm exists
if (searchTerm) {
  whereConditions.OR = [
    {
      freelancer : {
        name : {contains: searchTerm, mode: 'insensitive' }
      }  
    },
    { 
      job: { 
        title: { contains: searchTerm, mode: 'insensitive' } 
      } 
    },
    { 
      job: { 
        category: { contains: searchTerm, mode: 'insensitive' } 
      } 
    },
  ];
}

  const [data, total] = await prisma.$transaction([
    prisma.proposal.findMany({
      where: whereConditions,
      skip,
      take: limit,
      include: {
        job: true,
        freelancer: true,
      },
      orderBy: {
        createdAt: 'desc', // Default sorting
      },
    }),
    prisma.proposal.count({
      where: whereConditions,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
    data,
  };
};

/**
 * Get proposals for a specific job (Useful for Clients)
 * @param jobId - ID of the job
 */
/**
 * Retrieves proposals for a specific job with pagination.
 * @param jobId - ID of the job
 * @param options - Pagination options (page, limit)
 */
const getProposalsByJob = async (
  jobId: string,
  options: { page: number; limit: number }
) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  // Execute both queries in a transaction for better performance/consistency
  const [data, total] = await prisma.$transaction([
    prisma.proposal.findMany({
      where: { jobId },
      skip,
      take: limit,
      include: {
        freelancer: true,
      },
      orderBy: {
        createdAt: 'desc', // Optional: Show newest proposals first
      },
    }),
    prisma.proposal.count({
      where: { jobId },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
    data,
  };
};

/**
 * Update proposal status or details
 * @param id - Proposal ID
 * @param payload - Data to update
 */
const updateProposal = async (
  id: string,
  payload: Partial<Proposal>
): Promise<Proposal | null> => {
  const result = await prisma.proposal.update({
    where: { id },
    data: payload,
  });
  return result;
};

/**
 * Delete a proposal
 * @param id - Proposal ID
 */
const deleteProposal = async (id: string): Promise<Proposal | null> => {
  return await prisma.proposal.delete({
    where: { id },
  });
};

export const ProposalService = {
  createProposal,
  getAllProposals,
  getProposalsByJob,
  updateProposal,
  deleteProposal,
};