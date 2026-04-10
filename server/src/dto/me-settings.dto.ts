import { IsEnum, IsOptional, IsString } from "class-validator";
import { DifficultyLevel, KeyboardSetting, ThemeSetting } from "../enums";

export class UpdateMeSettingsDto {
  @IsEnum(ThemeSetting)
  @IsOptional()
  theme?: ThemeSetting;

  @IsEnum(KeyboardSetting)
  @IsOptional()
  keyboard_sound?: KeyboardSetting;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficulty?: DifficultyLevel;

  @IsString()
  @IsOptional()
  words_per_minute_goal?: string;
}
