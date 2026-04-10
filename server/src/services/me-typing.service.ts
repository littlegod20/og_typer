import { Repository } from "typeorm";
import { Lesson } from "../entities/lesson.entity";
import { TypingTest } from "../entities/typing_test.entity";
import { UserProgress } from "../entities/user_progress.entity";
import { UserProgressStatus } from "../enums";
import type { CreateTypingSessionDto } from "../dto/me-typing-session.dto";
import { BadgeAwardService } from "./badge-award.service";
import type { Badge } from "../entities/badge.entity";

export class MeTypingService {
  constructor(
    private readonly lessonRepository: Repository<Lesson>,
    private readonly typingTestRepository: Repository<TypingTest>,
    private readonly progressRepository: Repository<UserProgress>,
    private readonly badgeAwardService: BadgeAwardService
  ) {}

  async recordSession(
    userId: string,
    dto: CreateTypingSessionDto
  ): Promise<{ session: TypingTest; newBadges: Badge[] }> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: dto.lessonId },
      relations: ["text_sample"],
    });

    if (!lesson?.text_sample?.id) {
      throw new Error("Lesson or text sample not found");
    }

    const end = new Date();
    const start = new Date(end.getTime() - dto.durationSeconds * 1000);
    const typed =
      dto.charactersTyped ?? Math.max(0, Math.round((dto.wpm / 60) * dto.durationSeconds));
    const charsCorrect =
      dto.charactersCorrect ??
      Math.min(typed, Math.round((dto.accuracy / 100) * typed));

    const session = this.typingTestRepository.create({
      user: { id: userId },
      text_sample: { id: lesson.text_sample.id },
      start_time: start,
      end_time: end,
      total_duration: String(Math.round(dto.durationSeconds)),
      characters_correct: charsCorrect,
      wpm: dto.wpm,
      accuracy: dto.accuracy,
    });
    await this.typingTestRepository.save(session);

    let progress = await this.progressRepository.findOne({
      where: { user: { id: userId }, lesson: { id: lesson.id } },
    });

    if (!progress) {
      progress = this.progressRepository.create({
        user: { id: userId },
        lesson: { id: lesson.id },
        status: UserProgressStatus.COMPLETED,
        best_wpm: dto.wpm,
        best_accuracy: dto.accuracy,
        date_completed: end,
        number_of_attempts: 1,
      });
    } else {
      progress.number_of_attempts += 1;
      progress.best_wpm = Math.max(progress.best_wpm, dto.wpm);
      progress.best_accuracy = Math.max(progress.best_accuracy, dto.accuracy);
      progress.status = UserProgressStatus.COMPLETED;
      progress.date_completed = end;
    }
    await this.progressRepository.save(progress);

    const newBadges = await this.badgeAwardService.evaluateAfterSession(
      userId,
      dto.wpm
    );

    return { session, newBadges };
  }
}
