export interface User {
	id: string
	email: string
	full_name?: string
	avatar_url?: string
	username?: string
	created_at: string
	updated_at: string
	profile: UserProfile
	preferences: UserPreferences
	progress: UserProgress
	subscription?: UserSubscription
}

export interface UserProfile {
	bio?: string
	location?: string
	website?: string
	twitter_handle?: string
	github_handle?: string
	linkedin_handle?: string
	learning_goals: string[]
	current_role?: string
	experience_level: ExperienceLevel
	areas_of_interest: string[]
	timezone?: string
}

export interface UserPreferences {
	theme: 'light' | 'dark' | 'system'
	language: string
	notifications: NotificationPreferences
	privacy: PrivacyPreferences
	learning: LearningPreferences
}

export interface NotificationPreferences {
	email_notifications: boolean
	push_notifications: boolean
	daily_reminders: boolean
	weekly_summary: boolean
	achievement_alerts: boolean
	streak_reminders: boolean
	friend_activity: boolean
}

export interface PrivacyPreferences {
	show_progress_publicly: boolean
	show_achievements_publicly: boolean
	allow_friend_requests: boolean
	show_in_leaderboards: boolean
	data_sharing_consent: boolean
}

export interface LearningPreferences {
	daily_goal_minutes: number
	preferred_learning_times: string[]
	difficulty_preference: 'easy' | 'moderate' | 'challenging' | 'adaptive'
	voice_enabled: boolean
	auto_play_lessons: boolean
	show_hints: boolean
	pace: 'slow' | 'normal' | 'fast'
}

export interface UserProgress {
	current_level: number
	total_xp: number
	current_xp: number
	xp_to_next_level: number
	streak_count: number
	longest_streak: number
	last_activity_date: string
	total_lessons_completed: number
	total_time_spent_minutes: number
	skills_mastered: string[]
	achievements_unlocked: string[]
	current_learning_path?: string
	path_progress_percentage: number
	weak_areas: string[]
	strong_areas: string[]
}

export interface UserSubscription {
	plan: 'free' | 'premium' | 'pro' | 'enterprise'
	status: 'active' | 'cancelled' | 'past_due' | 'trialing'
	current_period_start: string
	current_period_end: string
	trial_end?: string
	features: string[]
}

export enum ExperienceLevel {
	BEGINNER = 'beginner',
	INTERMEDIATE = 'intermediate',
	ADVANCED = 'advanced',
	EXPERT = 'expert'
}

export interface UserSession {
	id: string
	user_id: string
	start_time: string
	end_time?: string
	duration_minutes?: number
	lessons_completed: number
	xp_gained: number
	achievements_earned: string[]
	device_info?: DeviceInfo
}

export interface DeviceInfo {
	platform: string
	browser?: string
	os?: string
	screen_resolution?: string
	user_agent?: string
} 