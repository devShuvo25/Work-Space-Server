import * as bcrypt from 'bcrypt';
import config from '../../config';
import prisma from '../utils/prisma';
import { UserRole } from '@prisma/client';

const seedSuperAdmin = async () => {
  try {
    await prisma.$transaction(async tx => {
      // 2️⃣ Check if Super Admin already exists
      const isAdminExists = await tx.user.findFirst({
        where: {
          role: UserRole.ADMIN,
        },
      });

      if (isAdminExists) {
        console.log('Super Admin already exists.');
        return;
      }

      // 3️⃣ Hash password
      const hashedPassword = await bcrypt.hash(
        config.super_admin_password as string,
        Number(config.bcrypt_salt_rounds) || 12,
      );

      // 4️⃣ Create Super Admin
      await tx.user.create({
        data: {
          name: 'Admin',
          email: 'admin@gmail.com',
          password: hashedPassword,
          role: UserRole.ADMIN,
          isEmailVerified: true,
        },
      });

      console.log('Super Admin created successfully.');
    });
  } catch (error) {
    // ❌ Any error → FULL rollback (department + user)
    console.error(
      'Error seeding Super Admin. Transaction rolled back.',
      error,
    );
  }
};

export default seedSuperAdmin;
