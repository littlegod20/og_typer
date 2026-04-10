import { Repository } from "typeorm";
import { TypingTest } from "../entities/typing_test.entity";
import { UserProgress } from "../entities/user_progress.entity";
import { UserProgressStatus } from "../enums";

export type UserStatsSummary = {
  totalSessions: number;
  averageWpm: number;
  bestWpm: number;
  lessonsCompleted: number;
  totalPracticeSeconds: number;
};

export class MeStatsService {
  constructor(
    private readonly typingTestRepository: Repository<TypingTest>,
    private readonly progressRepository: Repository<UserProgress>
  ) {}

  async getStatsForUser(userId: string): Promise<UserStatsSummary> {
    const totalSessions = await this.typingTestRepository.count({
      where: { user: { id: userId } },
    });

    const avgRow = await this.typingTestRepository
      .createQueryBuilder("t")
      .select("AVG(t.wpm)", "avg")
      .addSelect("MAX(t.wpm)", "max")
      .where("t.user_id = :uid", { uid: userId })
      .getRawOne<{ avg: string | null; max: string | null }>();

    const averageWpm =
      avgRow?.avg != null ? Math.round(parseFloat(avgRow.avg)) : 0;
    const bestWpm =
      avgRow?.max != null ? parseInt(avgRow.max, 10) : 0;

    const lessonsCompleted = await this.progressRepository.count({
      where: { user: { id: userId }, status: UserProgressStatus.COMPLETED },
    });

    const sumDuration = await this.typingTestRepository
      .createQueryBuilder("t")
      .select(
        "COALESCE(SUM(CAST(t.total_duration AS INTEGER)), 0)",
        "total"
      )
      .where("t.user_id = :uid", { uid: userId })
      .getRawOne<{ total: string }>();

    const totalPracticeSeconds = sumDuration?.total
      ? parseInt(sumDuration.total, 10)
      : 0;

    return {
      totalSessions,
      averageWpm,
      bestWpm,
      lessonsCompleted,
      totalPracticeSeconds,
    };
  }
}
