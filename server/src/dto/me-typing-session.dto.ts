import {
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from "class-validator";

export class CreateTypingSessionDto {
  @IsUUID()
  lessonId!: string;

  @IsInt()
  @Min(0)
  wpm!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  accuracy!: number;

  @IsNumber()
  @Min(0)
  durationSeconds!: number; // fractional seconds allowed

  @IsInt()
  @Min(0)
  @IsOptional()
  charactersTyped?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  charactersCorrect?: number;
}
