import { JwtPayload } from 'jsonwebtoken';

import { UserRole } from '@prisma/client';

export interface ITokenUser {
  id: string;      // The MongoDB ObjectId (as a string)
  name: string;    // Combined firstName and lastName
  email: string;
  role: UserRole;  // Enum: CLIENT, FREELANCER, or ADMIN
}
export interface IDecodedUser extends JwtPayload, ITokenUser {}
