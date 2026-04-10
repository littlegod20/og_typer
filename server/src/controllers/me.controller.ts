import { Request, Response } from "express";
import { AppDataSource } from "../config/database.config";
import { User } from "../entities/user.entity";
import { UserSettings } from "../entities/user_settings.entity";
import { UserBadge } from "../entities/user_badge.entity";
import { Lesson } from "../entities/lesson.entity";
import { TypingTest } from "../entities/typing_test.entity";
import { UserProgress } from "../entities/user_progress.entity";
import { Badge } from "../entities/badge.entity";
import { UserSettingsService } from "../services/user_settings.service";
import { MeTypingService } from "../services/me-typing.service";
import { MeStatsService } from "../services/me-stats.service";
import { BadgeAwardService } from "../services/badge-award.service";
import logger from "../config/logger";
import type { CreateTypingSessionDto } from "../dto/me-typing-session.dto";
import type { UpdateMeSettingsDto } from "../dto/me-settings.dto";

const userRepository = AppDataSource.getRepository(User);
const userSettingsRepository = AppDataSource.getRepository(UserSettings);
const userBadgeRepository = AppDataSource.getRepository(UserBadge);
const lessonRepository = AppDataSource.getRepository(Lesson);
const typingTestRepository = AppDataSource.getRepository(TypingTest);
const progressRepository = AppDataSource.getRepository(UserProgress);
const badgeRepository = AppDataSource.getRepository(Badge);

const userSettingService = new UserSettingsService(userSettingsRepository);

const badgeAwardService = new BadgeAwardService(
  badgeRepository,
  userBadgeRepository,
  progressRepository,
  typingTestRepository
);

const meTypingService = new MeTypingService(
  lessonRepository,
  typingTestRepository,
  progressRepository,
  badgeAwardService
);

const meStatsService = new MeStatsService(
  typingTestRepository,
  progressRepository
);

function requireUser(req: Request): User {
  const u = req.user as User | undefined;
  if (!u?.id) {
    throw new Error("Unauthorized");
  }
  return u;
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const authUser = requireUser(req);
    const user = await userRepository.findOne({
      where: { id: authUser.id },
      relations: ["user_settings"],
    });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    const { password, ...safe } = user;
    void password;
    res.status(200).json({
      success: true,
      message: "Profile loaded",
      data: safe,
    });
  } catch (error) {
    logger.error(`getProfile: ${error}`);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const patchSettings = async (req: Request, res: Response) => {
  try {
    const authUser = requireUser(req);
    const user = await userRepository.findOne({
      where: { id: authUser.id },
      relations: ["user_settings"],
    });
    if (!user?.user_settings?.id) {
      res.status(400).json({
        success: false,
        message: "User has no settings record",
      });
      return;
    }
    const body = req.body as UpdateMeSettingsDto;
    const updated = await userSettingService.update(user.user_settings.id, {
      theme: body.theme,
      keyboard_sound: body.keyboard_sound,
      difficulty: body.difficulty,
      words_per_minute_goal: body.words_per_minute_goal,
    });
    res.status(200).json({
      success: true,
      message: "Settings updated",
      data: updated,
    });
  } catch (error) {
    logger.error(`patchSettings: ${error}`);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const authUser = requireUser(req);
    const stats = await meStatsService.getStatsForUser(authUser.id);
    res.status(200).json({
      success: true,
      message: "Stats loaded",
      data: stats,
    });
  } catch (error) {
    logger.error(`getStats: ${error}`);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getMyBadges = async (req: Request, res: Response) => {
  try {
    const authUser = requireUser(req);
    const rows = await userBadgeRepository.find({
      where: { user: { id: authUser.id } },
      relations: ["badge"],
      order: { date_earned: "DESC" },
    });
    const data = rows.map((r) => ({
      date_earned: r.date_earned,
      badge: r.badge,
    }));
    res.status(200).json({
      success: true,
      message: "Badges loaded",
      data,
    });
  } catch (error) {
    logger.error(`getMyBadges: ${error}`);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const postTypingSession = async (req: Request, res: Response) => {
  try {
    const authUser = requireUser(req);
    const dto = req.body as CreateTypingSessionDto;
    const { session, newBadges } = await meTypingService.recordSession(
      authUser.id,
      dto
    );
    res.status(201).json({
      success: true,
      message: "Session recorded",
      data: {
        session: {
          id: session.id,
          wpm: session.wpm,
          accuracy: session.accuracy,
          total_duration: session.total_duration,
          created_At: session.created_At,
        },
        newBadges,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === "Lesson or text sample not found") {
      res.status(400).json({ success: false, message: msg });
      return;
    }
    logger.error(`postTypingSession: ${error}`);
    res.status(500).json({ success: false, message: msg });
  }
};
