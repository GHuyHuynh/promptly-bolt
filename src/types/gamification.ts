export interface Achievement {
	id: string
	title: string
	description: string
	category: AchievementCategory
	type: AchievementType
	rarity: AchievementRarity
	requirements: AchievementRequirement[]
	rewards: AchievementReward
	icon_url: string
	badge_url?: string
	is_hidden?: boolean
	unlock_conditions: UnlockCondition[]
	created_at: string
	updated_at: string
}

export interface AchievementRequirement {
	type: 'lessons_completed' | 'streak_days' | 'xp_earned' | 'skill_mastered' | 'time_spent' | 'perfect_scores' | 'social_interaction'
	target_value: number
	description: string
	current_progress?: number
}

export interface AchievementReward {
	xp: number
	badges: string[]
	titles: string[]
	special_privileges?: string[]
	cosmetic_items?: string[]
}

export interface UnlockCondition {
	type: 'prerequisite_achievement' | 'level_requirement' | 'time_based' | 'seasonal' | 'path_completion'
	value: Record<string, unknown>
	description: string
}

export enum AchievementCategory {
	LEARNING = 'learning',
	CONSISTENCY = 'consistency',
	MASTERY = 'mastery',
	SOCIAL = 'social',
	EXPLORATION = 'exploration',
	MILESTONE = 'milestone',
	SPECIAL = 'special'
}

export enum AchievementType {
	PROGRESS = 'progress',
	CHALLENGE = 'challenge',
	MILESTONE = 'milestone',
	COLLECTION = 'collection',
	SEASONAL = 'seasonal',
	HIDDEN = 'hidden'
}

export enum AchievementRarity {
	COMMON = 'common',
	UNCOMMON = 'uncommon',
	RARE = 'rare',
	EPIC = 'epic',
	LEGENDARY = 'legendary'
}

export interface SkillTree {
	id: string
	title: string
	description: string
	category: SkillCategory
	nodes: SkillNode[]
	layout_config: TreeLayoutConfig
	is_featured: boolean
	prerequisites?: string[]
	estimated_completion_hours: number
	created_at: string
	updated_at: string
}

export interface SkillNode {
	id: string
	title: string
	description: string
	type: NodeType
	position: NodePosition
	dependencies: string[] // Other node IDs that must be completed first
	requirements: NodeRequirement[]
	rewards: NodeReward
	lessons: string[] // Lesson IDs associated with this node
	estimated_duration_hours: number
	difficulty: 'beginner' | 'intermediate' | 'advanced'
	status: NodeStatus
	completion_percentage: number
	icon: string
	color_theme: string
}

export interface NodePosition {
	x: number
	y: number
	level: number // Depth in the tree
}

export interface NodeRequirement {
	type: 'lessons_completed' | 'quiz_passed' | 'project_submitted' | 'peer_reviewed'
	description: string
	target_value: number
	current_progress: number
}

export interface NodeReward {
	xp: number
	skill_points: number
	badges?: string[]
	unlocks?: string[] // What this node unlocks (tools, features, content)
}

export interface TreeLayoutConfig {
	theme: string
	node_spacing: number
	level_spacing: number
	connection_style: 'straight' | 'curved' | 'organic'
	animation_style: 'minimal' | 'standard' | 'elaborate'
}

export enum SkillCategory {
	PROMPT_ENGINEERING = 'prompt_engineering',
	AI_TOOLS = 'ai_tools',
	CREATIVE_AI = 'creative_ai',
	BUSINESS_AI = 'business_ai',
	TECHNICAL_AI = 'technical_ai',
	ETHICS_AI = 'ethics_ai',
	ADVANCED_CONCEPTS = 'advanced_concepts'
}

export enum NodeType {
	FOUNDATION = 'foundation',
	SKILL = 'skill',
	MILESTONE = 'milestone',
	SPECIALIZATION = 'specialization',
	CAPSTONE = 'capstone'
}

export enum NodeStatus {
	LOCKED = 'locked',
	AVAILABLE = 'available',
	IN_PROGRESS = 'in_progress',
	COMPLETED = 'completed',
	MASTERED = 'mastered'
}

export interface Leaderboard {
	id: string
	title: string
	description: string
	type: LeaderboardType
	period: LeaderboardPeriod
	entries: LeaderboardEntry[]
	last_updated: string
	total_participants: number
	user_rank?: number
	filters?: LeaderboardFilter[]
}

export interface LeaderboardEntry {
	rank: number
	user_id: string
	username: string
	avatar_url?: string
	score: number
	metric_value: Record<string, unknown> // Could be XP, lessons completed, streak, etc.
	badges: string[]
	level: number
	change_from_previous?: number // Rank change
	country?: string
	join_date: string
}

export interface LeaderboardFilter {
	type: 'country' | 'age_group' | 'experience_level' | 'learning_path'
	value: string
	label: string
}

export enum LeaderboardType {
	XP = 'xp',
	STREAK = 'streak',
	LESSONS_COMPLETED = 'lessons_completed',
	TIME_SPENT = 'time_spent',
	SKILL_MASTERY = 'skill_mastery',
	ACHIEVEMENTS = 'achievements',
	PEER_HELPING = 'peer_helping'
}

export enum LeaderboardPeriod {
	DAILY = 'daily',
	WEEKLY = 'weekly',
	MONTHLY = 'monthly',
	ALL_TIME = 'all_time',
	SEASONAL = 'seasonal'
}

export interface Badge {
	id: string
	title: string
	description: string
	icon_url: string
	category: BadgeCategory
	rarity: AchievementRarity
	requirements: string
	awarded_count: number
	first_awarded_date?: string
	special_effects?: BadgeEffect[]
}

export interface BadgeEffect {
	type: 'xp_multiplier' | 'cosmetic' | 'feature_unlock' | 'social_status'
	value: Record<string, unknown>
	duration?: number // In days, null for permanent
	description: string
}

export enum BadgeCategory {
	LEARNING = 'learning',
	SOCIAL = 'social',
	SEASONAL = 'seasonal',
	ACHIEVEMENT = 'achievement',
	PARTICIPATION = 'participation',
	LEADERSHIP = 'leadership'
}

export interface Streak {
	id: string
	user_id: string
	current_count: number
	longest_count: number
	last_activity_date: string
	streak_type: StreakType
	milestones_reached: StreakMilestone[]
	is_active: boolean
	freeze_cards_used: number
	max_freeze_cards: number
}

export interface StreakMilestone {
	days: number
	title: string
	reward_xp: number
	badge_id?: string
	reached_date?: string
}

export enum StreakType {
	DAILY_LESSON = 'daily_lesson',
	WEEKLY_GOAL = 'weekly_goal',
	PRACTICE_SESSION = 'practice_session',
	SKILL_BUILDING = 'skill_building'
}

export interface SocialChallenge {
	id: string
	title: string
	description: string
	type: ChallengeType
	start_date: string
	end_date: string
	participants: ChallengeParticipant[]
	rewards: ChallengeReward[]
	requirements: ChallengeRequirement[]
	status: ChallengeStatus
	max_participants?: number
	is_team_based: boolean
	visibility: 'public' | 'friends' | 'private'
}

export interface ChallengeParticipant {
	user_id: string
	username: string
	avatar_url?: string
	progress: number
	rank: number
	team_id?: string
	join_date: string
	completion_date?: string
}

export interface ChallengeReward {
	rank_range: [number, number] // [min_rank, max_rank]
	xp: number
	badges: string[]
	special_items?: string[]
	titles?: string[]
}

export interface ChallengeRequirement {
	type: 'lessons_completed' | 'xp_earned' | 'skills_mastered' | 'time_spent'
	target_value: number
	description: string
}

export enum ChallengeType {
	INDIVIDUAL = 'individual',
	TEAM = 'team',
	COMMUNITY = 'community',
	GLOBAL = 'global'
}

export enum ChallengeStatus {
	UPCOMING = 'upcoming',
	ACTIVE = 'active',
	COMPLETED = 'completed',
	CANCELLED = 'cancelled'
}

export interface XPSystem {
	base_lesson_xp: number
	quiz_completion_multiplier: number
	perfect_score_bonus: number
	streak_multiplier: number
	level_thresholds: number[]
	daily_bonus_xp: number
	referral_bonus_xp: number
	community_contribution_xp: number
}

export interface LevelInfo {
	level: number
	title: string
	min_xp: number
	max_xp: number
	perks: string[]
	badge_id?: string
	special_features?: string[]
} 