import { ExperienceLevel, Job, Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a new job
 */
const createJob = async (data: Job): Promise<Job> => {
  return await prisma.job.create({
    data,
    include: {
      client: {
        select: { name: true, email: true, image: true },
      },
    },
  });
};

/**
 * Get all jobs with Search, Filter, and Pagination
 */
const getAllJobs = async (
  filters: {
    searchTerm?: string;
    category?: string;
    experienceLevel?: string;
    createdAt?: string;
  },
  paginationOptions: { page?: number; limit?: number }
) => {
  const { searchTerm, category, experienceLevel, createdAt } = filters;
  const { page = 1, limit = 10 } = paginationOptions;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.JobWhereInput[] = [];

  // Partial search for title or description
  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { category: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  // Exact filters
  // Exact filters with Case Insensitivity
if (category) {
  andConditions.push({
    category: {
      equals: category,
      mode: 'insensitive', 
    },
  });
}
  if (experienceLevel) andConditions.push({ experienceLevel: experienceLevel as ExperienceLevel });

  // Resolved Date logic
  if (createdAt) {
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // ডিফল্টভাবে আজকের শুরুর সময়

    if (createdAt === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (createdAt === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } 
    // যদি createdAt 'today' হয়, তবে উপরের ডিফল্ট 00:00:00 ই থাকবে

    andConditions.push({ 
      createdAt: { 
        gte: startDate 
      } 
    });
  }

  const whereConditions: Prisma.JobWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Fetch data and total count in parallel for performance
  const [result, total] = await Promise.all([
    prisma.job.findMany({
      where: whereConditions,
      include: {
        client: { select: { id: true, name: true, image: true } },
        _count: { select: { proposals: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.job.count({ where: whereConditions }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
    data: result,
  };
};

/**
 * Get single job by ID
 */
const getJobById = async (id: string): Promise<Job | null> => {
  return await prisma.job.findUnique({
    where: { id },
    // include: {
    //   client: { select: { id: true, name: true, email: true, image: true,
    //     createdAt:true, profile: true } },
    //   proposals: { include: { freelancer: { select: { id: true, name: true, image: true } } } },
    // },
    include: {
  client: { 
    select: { 
      id: true, 
      name: true, 
      email: true, 
      image: true,
      createdAt: true, 
      profile: true 
    } 
  },
  proposals: { 
    include: { 
      freelancer: { 
        include: { 
          profile: true // This gets the full Bio, Skills, Rating, etc.
        } 
      } 
    } 
  },
},
  });
};
/**
 * Get all jobs posted by the specific client (logged-in user)
 */
const getMyJobs = async (clientId: string) => {
  return await prisma.job.findMany({
    where: {
      clientId: clientId,
    },
    include: {
      _count: {
        select: { proposals: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};


/**
 * Update job
 */
const updateJob = async (id: string, payload: Partial<Job>): Promise<Job | null> => {
  const isExist = await prisma.job.findUnique({ where: { id } });
  if (!isExist) throw new Error('Job not found!');

  return await prisma.job.update({
    where: { id },
    data: payload,
    include: { client: { select: { name: true, image: true } } },
  });
};

/**
 * Delete job
 */
const deleteJob = async (id: string): Promise<Job | null> => {
  const isExist = await prisma.job.findUnique({ where: { id } });
  if (!isExist) throw new Error('Job not found!');

  return await prisma.job.delete({ where: { id } });
};

export const JobService = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs
};