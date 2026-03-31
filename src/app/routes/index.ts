import express, { Router, Request, Response } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
// need to import below two to upload image -> upload is the middleware
// uploadImage is the function
import { upload } from '../middlewares/upload';

import { UserRoutes } from '../modules/user/user.routes';
import { ProfileRoutes } from '../modules/profile/profile.route';
import { ChatRoutes } from '../modules/messages/message.route';
import { JobRoutes } from '../modules/jobs/jobs.routes';
import { ProposalRoutes } from '../modules/proposals/proposals.routes';
import { AIRoutes } from '../modules/AI_assistant/ai.routes';
import { NotificationRoutes } from '../modules/notification/notification.routes';


const router: Router = express.Router();

interface ModuleRoute {
  path: string;
  route: Router;
}

const moduleRoutes: ModuleRoute[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path : "/profile",
    route : ProfileRoutes
  },
  {
    path : '/jobs',
    route : JobRoutes
  },
  {
    path : "/proposals",
    route : ProposalRoutes
  },
  {
    path : "/chats",
    route : ChatRoutes
  },
  {
    path : '/ai',
    route: AIRoutes
  },
  {
    path : '/notifications',
    route : NotificationRoutes
  }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

// ROUTER TO UPLOAD IMAGE
/**
 * @method POST
 * @route {baseUrl}/upload
 * @select form-data in postman
 * @set key "image" and select image from your device
 */

export default router;
