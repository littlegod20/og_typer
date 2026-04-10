import { Repository } from "typeorm";
import { UserSettings } from "../entities/user_settings.entity";
import { CreateSettingsDto } from "../dto/user_settings.dto";
import { DifficultyLevel, KeyboardSetting, ThemeSetting } from "../enums";

export class UserSettingsService {
  constructor(
    private readonly userSettingsRepository: Repository<UserSettings>
  ) { }

  async getAll() {
    const userSettings = await this.userSettingsRepository.find()
    return userSettings
  }

  async getById(id: string) {
    const userSetting = await this.userSettingsRepository.findOne({ where: { id } })
    return userSetting
  }

  async create(userSetting?: CreateSettingsDto) {
    let setting: CreateSettingsDto;
    if (!userSetting) {
      setting = this.userSettingsRepository.create()
      return await this.userSettingsRepository.save(setting)
    }

    setting = this.userSettingsRepository.create(userSetting)
    return await this.userSettingsRepository.save(setting)
  }

  async update(
    id: string,
    userSettingData: Partial<
      Pick<
        UserSettings,
        "theme" | "keyboard_sound" | "difficulty" | "words_per_minute_goal"
      >
    >
  ) {
    const payload: Partial<
      Pick<
        UserSettings,
        "theme" | "keyboard_sound" | "difficulty" | "words_per_minute_goal"
      >
    > = {};
    if (userSettingData.theme !== undefined)
      payload.theme = userSettingData.theme;
    if (userSettingData.keyboard_sound !== undefined)
      payload.keyboard_sound = userSettingData.keyboard_sound;
    if (userSettingData.difficulty !== undefined)
      payload.difficulty = userSettingData.difficulty;
    if (userSettingData.words_per_minute_goal !== undefined)
      payload.words_per_minute_goal = userSettingData.words_per_minute_goal;

    if (Object.keys(payload).length > 0) {
      await this.userSettingsRepository.update({ id }, payload);
    }

    return await this.userSettingsRepository.findOne({ where: { id } });
  }

  async reset(id: string) {
    const userSetting = await this.userSettingsRepository.update({
      id
    }, {
      theme: ThemeSetting.LIGHT,
      keyboard_sound: KeyboardSetting.ON,
      difficulty: DifficultyLevel.BEGINNER,
      words_per_minute_goal: '40'
    })
    return await this.userSettingsRepository.findOne({ where: { id } })
  }
}