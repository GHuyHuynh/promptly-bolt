export interface ApiResponse<T = unknown> {
	data?: T
	error?: ApiError
	message?: string
	success: boolean
	timestamp: string
	request_id: string
	pagination?: PaginationInfo
}

export interface ApiError {
	code: string
	message: string
	details?: Record<string, unknown>
	field_errors?: FieldError[]
	suggestion?: string
	documentation_url?: string
}

export interface FieldError {
	field: string
	code: string
	message: string
	value?: unknown
}

export interface PaginationInfo {
	current_page: number
	per_page: number
	total_pages: number
	total_count: number
	has_next_page: boolean
	has_previous_page: boolean
	next_cursor?: string
	previous_cursor?: string
}

export interface ListRequest {
	page?: number
	per_page?: number
	cursor?: string
	sort_by?: string
	sort_order?: 'asc' | 'desc'
	filters?: Record<string, unknown>
	search?: string
	include?: string[]
	fields?: string[]
}

export interface AuthRequest {
	email?: string
	password?: string
	provider?: 'google' | 'github' | 'apple' | 'facebook'
	token?: string
	refresh_token?: string
	remember_me?: boolean
}

export interface AuthResponse {
	user: {
		id: string
		email: string
		full_name?: string
		avatar_url?: string
		username?: string
		email_verified: boolean
		phone_verified: boolean
		created_at: string
		last_sign_in_at?: string
	}
	session: {
		access_token: string
		refresh_token: string
		expires_at: number
		token_type: string
		provider_token?: string
		provider_refresh_token?: string
	}
	is_new_user: boolean
}

export interface UserUpdateRequest {
	full_name?: string
	username?: string
	avatar_url?: string
	bio?: string
	location?: string
	website?: string
	social_links?: Record<string, string>
	learning_goals?: string[]
	areas_of_interest?: string[]
	experience_level?: string
	preferences?: Record<string, unknown> // Generic preferences object
}

export interface LessonProgressRequest {
	lesson_id: string
	action: 'start' | 'progress' | 'complete' | 'pause' | 'resume'
	completion_percentage?: number
	time_spent_seconds?: number
	quiz_answers?: QuizAnswerData[]
	exercise_submissions?: ExerciseSubmissionData[]
	notes?: string
}

export interface QuizAnswerData {
	question_id: string
	selected_answers: string[]
	is_correct: boolean
	time_spent_seconds: number
	attempts: number
}

export interface ExerciseSubmissionData {
	exercise_id: string
	submission: string
	is_correct: boolean
	feedback?: string
	hints_used: number
	time_spent_seconds: number
}

export interface ProgressResponse {
	lesson_progress: {
		lesson_id: string
		completion_percentage: number
		status: 'not_started' | 'in_progress' | 'completed'
		time_spent_minutes: number
		last_accessed: string
		quiz_scores: Record<string, number>
		exercise_completions: Record<string, boolean>
	}
	user_progress: {
		xp_gained: number
		level_ups: number
		achievements_unlocked: string[]
		streak_updated: boolean
		badges_earned: string[]
	}
	recommendations?: LessonRecommendation[]
}

export interface LessonRecommendation {
	lesson_id: string
	title: string
	reason: string
	confidence_score: number
	estimated_duration_minutes: number
	difficulty: string
	prerequisites_met: boolean
}

export interface LeaderboardRequest {
	type: 'xp' | 'streak' | 'lessons' | 'time'
	period: 'daily' | 'weekly' | 'monthly' | 'all_time'
	filters?: {
		country?: string
		age_group?: string
		experience_level?: string
		learning_path?: string
	}
	limit?: number
	include_user_rank?: boolean
}

export interface AchievementUnlockRequest {
	achievement_id: string
	trigger_data: Record<string, unknown>
	timestamp: string
}

export interface NotificationRequest {
	type: 'push' | 'email' | 'in_app'
	title: string
	message: string
	data?: Record<string, unknown>
	scheduled_for?: string
	user_ids?: string[]
	filters?: NotificationFilters
}

export interface NotificationFilters {
	countries?: string[]
	experience_levels?: string[]
	learning_paths?: string[]
	subscription_plans?: string[]
	last_active_days?: number
}

export interface AnalyticsRequest {
	event_name: string
	properties: Record<string, unknown>
	timestamp: string
	session_id?: string
	user_id?: string
	anonymous_id?: string
}

export interface FeedbackRequest {
	type: 'bug' | 'feature' | 'content' | 'general'
	subject: string
	message: string
	rating?: number
	lesson_id?: string
	page_url?: string
	browser_info?: BrowserInfo
	attachments?: string[]
}

export interface BrowserInfo {
	user_agent: string
	browser: string
	version: string
	os: string
	screen_resolution: string
	viewport_size: string
	timezone: string
	language: string
}

export interface SearchRequest {
	query: string
	type?: 'lessons' | 'paths' | 'achievements' | 'users' | 'all'
	filters?: SearchFilters
	limit?: number
	offset?: number
	highlight?: boolean
}

export interface SearchFilters {
	difficulty?: string[]
	duration_range?: [number, number]
	tags?: string[]
	category?: string[]
	author?: string
	date_range?: [string, string]
	rating_min?: number
}

export interface SearchResponse {
	results: SearchResult[]
	total_count: number
	search_time_ms: number
	suggestions?: string[]
	filters_applied: SearchFilters
}

export interface SearchResult {
	id: string
	type: 'lesson' | 'path' | 'achievement' | 'user'
	title: string
	description: string
	url: string
	score: number
	highlights?: Record<string, string[]>
	metadata?: Record<string, unknown>
}

export interface WebhookPayload {
	event: string
	data: Record<string, unknown>
	timestamp: string
	version: string
	signature: string
}

export interface RateLimitInfo {
	limit: number
	remaining: number
	reset_time: number
	retry_after?: number
}

export interface HealthCheckResponse {
	status: 'healthy' | 'degraded' | 'unhealthy'
	timestamp: string
	version: string
	services: ServiceStatus[]
	uptime_seconds: number
}

export interface ServiceStatus {
	name: string
	status: 'operational' | 'degraded' | 'down'
	response_time_ms?: number
	last_check: string
	details?: string
}

export interface BatchRequest<T> {
	operations: BatchOperation<T>[]
	atomic?: boolean
	max_errors?: number
}

export interface BatchOperation<T> {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
	path: string
	body?: T
	headers?: Record<string, string>
	id?: string
}

export interface BatchResponse<T> {
	results: BatchResult<T>[]
	summary: {
		total: number
		success: number
		errors: number
		processing_time_ms: number
	}
}

export interface BatchResult<T> {
	id?: string
	status: number
	data?: T
	error?: ApiError
	headers?: Record<string, string>
}

// Specific endpoint types
export interface CreateLessonRequest {
	title: string
	description: string
	type: string
	difficulty: string
	content: Record<string, unknown>
	tags?: string[]
	learning_path_id?: string
	prerequisites?: string[]
	estimated_duration_minutes: number
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {
	id: string
	status?: 'draft' | 'review' | 'published' | 'archived'
}

export interface CreatePathRequest {
	title: string
	description: string
	difficulty: string
	lessons: string[]
	prerequisites?: string[]
	tags?: string[]
	is_featured?: boolean
}

export interface EnrollmentRequest {
	learning_path_id: string
	auto_enroll_prerequisites?: boolean
}

export interface SubscriptionRequest {
	plan_id: string
	payment_method?: string
	coupon_code?: string
	billing_address?: BillingAddress
}

export interface BillingAddress {
	street: string
	city: string
	state: string
	country: string
	postal_code: string
}

export interface PaymentResponse {
	payment_intent_id: string
	client_secret: string
	status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded'
	next_action?: Record<string, unknown>
} 