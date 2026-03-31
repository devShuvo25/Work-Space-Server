import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { upload } from "../../../config/upload.config"; 
import { ProfileController } from "./profile.controller";
import { ProfileValidation } from "./profile.validation";

const router = express.Router();

/**
 * Validation Map
 */
const validationMap: Record<string, any> = {
  portfolio: { 
    create: ProfileValidation.createPortfolio, 
    update: ProfileValidation.updatePortfolio 
  },
  education: { 
    create: ProfileValidation.createEducation, 
    update: ProfileValidation.updateEducation 
  },
  experience: { 
    create: ProfileValidation.createExperience, 
    update: ProfileValidation.updateExperience 
  },
  certification: { 
    create: ProfileValidation.createCertification, 
    update: ProfileValidation.updateCertification 
  },
  testimonial: { 
    create: ProfileValidation.createTestimonial, 
    update: ProfileValidation.updateTestimonial 
  },
};

// --- Core Profile Routes ---

router.get(
  "/my-profile",
  auth("FREELANCER", "CLIENT"),
  ProfileController.getProfile
);

router.patch(
  "/update-profile",
  auth("FREELANCER", "CLIENT"),
  upload.single("image"), 
  ProfileController.updateProfile
);

// --- Dynamic Relation Routes ---

router
  .route("/manage/:model/:id?")
  .post(
    auth("FREELANCER"),
    (req, res, next) => {
      if (req.params.model === "certification") {
        return upload.fields([
          { name: "image", maxCount: 1 },
          { name: "certificate", maxCount: 1 }
        ])(req, res, next);
      }
      return upload.single("imageUrl")(req, res, next);
    },
    (req, res, next) => {
      const modelName = req.params.model;
      const schema = validationMap[modelName]?.create;
      
      if (!schema) {
        return res.status(400).json({ 
          success: false, 
          message: `Invalid model type: ${modelName}` 
        });
      }

      
      if (req.file) {
        req.body.imageUrl = req.file.path; 
      } else if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files['image']) req.body.image = files['image'][0].path;
        if (files['certificate']) req.body.media = files['certificate'][0].path;
      }

      return validateRequest(schema)(req, res, next);
    },
    ProfileController.manageProfileRelation
  )
  .patch(
    auth("FREELANCER"),
    (req, res, next) => {
      if (req.params.model === "certification") {
        return upload.fields([
          { name: "image", maxCount: 1 },
          { name: "certificate", maxCount: 1 }
        ])(req, res, next);
      }
      return upload.single("imageUrl")(req, res, next);
    },
    (req, res, next) => {
      const modelName = req.params.model;
      const schema = validationMap[modelName]?.update;

      if (!schema) {
        return res.status(400).json({ 
          success: false, 
          message: `Invalid model type: ${modelName}` 
        });
      }

      if (req.file) {
        req.body.imageUrl = req.file.path;
      } else if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files['image']) req.body.image = files['image'][0].path;
        if (files['certificate']) req.body.media = files['certificate'][0].path;
      }

      return validateRequest(schema)(req, res, next);
    },
    ProfileController.manageProfileRelation
  )
  .delete(
    auth("FREELANCER"),
    ProfileController.manageProfileRelation
  );

export const ProfileRoutes = router;