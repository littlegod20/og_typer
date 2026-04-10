export interface ApiUser {
  id: string
  username: string
  email: string
  created_at?: string
  updated_at?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface Course {
  id: string
  name: string
  description: string | null
  created_at?: string
  updated_at?: string
}

export interface TextSampleSummary {
  id: string
  title?: string
  content?: string
  difficulty_level?: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  order_index: number
  course?: Pick<Course, 'id' | 'name'>
  text_sample?: TextSampleSummary | null
  prerequisite_lesson?: Pick<Lesson, 'id' | 'title' | 'order_index'> | null
}

export interface TextSample extends TextSampleSummary {
  content: string
  title: string
  category?: string
  difficulty_level?: string
  language?: string
  source?: string
}

export interface ApiListResponse<T> {
  success: boolean
  message?: string
  data?: T
}

export interface ApiErrorBody {
  message?: string
  msg?: string
  success?: boolean
  errors?: Array<{ property: string; constraints?: Record<string, string> }>
}

export interface UserSettings {
  id: string
  theme: string
  keyboard_sound: string
  difficulty: string
  words_per_minute_goal: string | null
}

export interface ProfileUser extends ApiUser {
  user_settings?: UserSettings | null
}

export interface UserStatsSummary {
  totalSessions: number
  averageWpm: number
  bestWpm: number
  lessonsCompleted: number
  totalPracticeSeconds: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon_url: string
}

export interface EarnedBadgeEntry {
  date_earned: string
  badge: Badge
}

export interface TypingSessionPayload {
  lessonId: string
  wpm: number
  accuracy: number
  durationSeconds: number
  charactersTyped: number
  charactersCorrect: number
}

export interface TypingSessionResponseData {
  session: {
    id: string
    wpm: number
    accuracy: number
    total_duration: string
    created_At: string
  }
  newBadges: Badge[]
}

export type TypingCompletePayload = {
  wpm: number
  accuracy: number
  durationSeconds: number
  typedLength: number
  mistakes: number
}
