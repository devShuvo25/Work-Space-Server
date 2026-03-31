import * as bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';
import { IUpdateUser } from './user.interface';
import { Prisma, UserRole, UserStatus } from '@prisma/client';

/**
 * Get All Users: Supports pagination and returns a meta object.
 * Standardizes the "name" field for your marketplace.
 */
const getAllUsersFromDB = async (searchTerm: string, currentUserId?: string) => {
  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        // এখানে সরাসরি 'searchTerm' (string) দিতে হবে, অবজেক্ট নয়
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  if (currentUserId) {
    andConditions.push({
      id: { not: currentUserId },
    });
  }

  const result = await prisma.user.findMany({
    where: {
      AND: andConditions,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    take: 10,
  });

  return result;
};
/**
 * Get User By ID: Includes the nested professional profile.
 */
const getUserByIdFromDB = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true, 
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Ensure sensitive data like password is not returned
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Update User: Handles password hashing and status changes.
 */
const updateUserIntoDB = async (id: string, payload: Partial<IUpdateUser>) => {
  const isUserExist = await prisma.user.findUnique({ where: { id } });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  console.log("Payload is :",payload)

  // Hash password if it's being updated
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 12);
  }

  const user = await prisma.user.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      image: true,
      address : true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
      // Include the profile so the frontend gets the latest professional data
      profile: {
        select: {
          headline: true,
          bio: true,
          skills: true,
          category: true,
          rating: true,
          availability: true,
        }
      }
    },
  });
  
  return user;
};

/**
 * Delete User: Performs a soft delete (DEACTIVATED) to preserve marketplace history.
 */


export const UserServices = {
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserIntoDB,
};