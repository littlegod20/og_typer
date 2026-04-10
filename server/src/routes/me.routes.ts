import { Router } from "express";
import passport from "passport";
import { validateDto } from "../middleware/validationDto.middleware";
import { CreateTypingSessionDto } from "../dto/me-typing-session.dto";
import { UpdateMeSettingsDto } from "../dto/me-settings.dto";
import {
  getProfile,
  patchSettings,
  getStats,
  getMyBadges,
  postTypingSession,
} from "../controllers/me.controller";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/profile", getProfile);
router.patch(
  "/settings",
  validateDto(UpdateMeSettingsDto),
  patchSettings
);
router.get("/stats", getStats);
router.get("/badges", getMyBadges);
router.post(
  "/typing-sessions",
  validateDto(CreateTypingSessionDto),
  postTypingSession
);

export default router;
