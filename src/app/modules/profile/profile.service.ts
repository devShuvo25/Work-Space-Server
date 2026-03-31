import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ProfileService = {
  /**
   * Fetches the full profile including all relational arrays.
   */
  getProfileData: async (userId: string) => {
    return await prisma.user.findUnique({
      where: { id: userId },
      include : {
        profile: {
            include : {
                portfolios: true,
                testimonials : true,
                education : true,
                certifications : true,
                experience: true     
            }
        }
      }
    });
  },

  /**
   * Updates core user and profile data.
   */
updateProfile: async (userId: string, data: any) => {
  const { name, address, image, ...profileFields } = data;
  console.log("Data:",data, "userid :",userId)

  return await prisma.$transaction(async (tx) => {
    // 1. Update User basic info
    await tx.user.update({
      where: { id: userId },
      data: { name, address, image },
    });

    // 2. Upsert the Profile
    return await tx.profile.upsert({
      where: { userId },
      create: { 
        userId, 
        ...profileFields 
      },
      update: profileFields,
    });
  });
},
  /**
   * Generic Add: Case-sensitivity matters here. 
   */
  addRelationItem: async (model: string, profileId: string, data: any) => {
    return await (prisma[model as any] as any).create({
      
      data: {
        ...data,
        profileId,
      },
    });
  },

  /**
   * Generic Update
   */
  updateRelationItem: async (model: string, id: string, data: any) => {
    return await (prisma[model as any] as any).update({
      where: { id },
      data,
    });
  },

  /**
   * Generic Delete
   */
  deleteRelationItem: async (model: string, id: string) => {
    return await (prisma[model as any] as any).delete({
      where: { id },
    });
  },

  /**
   * Get all items for a specific section
   */
  getRelationItems: async (model: string, profileId: string) => {
    return await (prisma[model as any] as any).findMany({
      where: { profileId },
    });
  }
};

export const {
  getProfileData,
  updateProfile,
  updateRelationItem,
  getRelationItems,
  deleteRelationItem,
  addRelationItem
} = ProfileService;