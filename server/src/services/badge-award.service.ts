import { Repository } from "typeorm";
import { Badge } from "../entities/badge.entity";
import { UserBadge } from "../entities/user_badge.entity";
import { UserProgress } from "../entities/user_progress.entity";
import { TypingTest } from "../entities/typing_test.entity";
import { UserProgressStatus } from "../enums";

export const BADGE_FIRST_STEPS = "First Steps";
export const BADGE_DEDICATED = "Dedicated";
export const BADGE_SPEED_DEMON = "Speed Demon";

export class BadgeAwardService {
  constructor(
    private readonly badgeRepository: Repository<Badge>,
    private readonly userBadgeRepository: Repository<UserBadge>,
    private readonly progressRepository: Repository<UserProgress>,
    private readonly typingTestRepository: Repository<TypingTest>
  ) {}

  private async awardIfMissing(
    userId: string,
    badgeName: string
  ): Promise<Badge | null> {
    const badge = await this.badgeRepository.findOne({
      where: { name: badgeName },
    });
    if (!badge) return null;

    const existing = await this.userBadgeRepository.findOne({
      where: { user: { id: userId }, badge: { id: badge.id } },
    });
    if (existing) return null;

    await this.userBadgeRepository.save(
      this.userBadgeRepository.create({
        user: { id: userId },
        badge: { id: badge.id },
      })
    );
    return badge;
  }

  /** Call after a typing session is persisted. */
  async evaluateAfterSession(
    userId: string,
    sessionWpm: number
  ): Promise<Badge[]> {
    const earned: Badge[] = [];

    const completedLessons = await this.progressRepository.count({
      where: { user: { id: userId }, status: UserProgressStatus.COMPLETED },
    });
    if (completedLessons >= 1) {
      const b = await this.awardIfMissing(userId, BADGE_FIRST_STEPS);
      if (b) earned.push(b);
    }

    const sessionCount = await this.typingTestRepository.count({
      where: { user: { id: userId } },
    });
    if (sessionCount >= 10) {
      const b = await this.awardIfMissing(userId, BADGE_DEDICATED);
      if (b) earned.push(b);
    }

    const maxRow = await this.typingTestRepository
      .createQueryBuilder("t")
      .select("MAX(t.wpm)", "max")
      .where("t.user_id = :uid", { uid: userId })
      .getRawOne<{ max: string | null }>();
    const maxWpm = Math.max(
      sessionWpm,
      maxRow?.max != null ? parseInt(maxRow.max, 10) : 0
    );
    if (maxWpm >= 60) {
      const b = await this.awardIfMissing(userId, BADGE_SPEED_DEMON);
      if (b) earned.push(b);
    }

    return earned;
  }
}
