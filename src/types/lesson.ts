export interface Lesson {
	id: string
	title: string
	description: string
	content: LessonContent
	type: LessonType
	difficulty: DifficultyLevel
	duration_minutes: number
	xp_reward: number
	prerequisites: string[]
	tags: string[]
	skill_tree_node_id?: string
	learning_path_id?: string
	order_in_path?: number
	created_at: string
	updated_at: string
	published_at?: string
	author_id?: string
	status: LessonStatus
	metadata: LessonMetadata
}

export interface LessonContent {
	introduction?: ContentBlock
	sections: LessonSection[]
	conclusion?: ContentBlock
	resources?: Resource[]
	exercises?: Exercise[]
	quiz?: Quiz
	practical_application?: PracticalApplication
}

export interface ContentBlock {
	type: 'text' | 'video' | 'audio' | 'image' | 'code' | 'interactive'
	content: string
	metadata?: Record<string, unknown>
	voice_narration?: VoiceNarration
}

export interface LessonSection {
	id: string
	title: string
	content: ContentBlock[]
	learning_objectives: string[]
	estimated_duration_minutes: number
	interactive_elements?: InteractiveElement[]
}

export interface VoiceNarration {
	audio_url: string
	transcript: string
	voice_id: string
	duration_seconds: number
	language: string
}

export interface InteractiveElement {
	id: string
	type: 'quiz_question' | 'coding_challenge' | 'drag_drop' | 'fill_blank' | 'simulation'
	content: Record<string, unknown>
	validation_rules: ValidationRule[]
	hints?: string[]
	points: number
}

export interface ValidationRule {
	type: 'exact_match' | 'contains' | 'regex' | 'custom'
	pattern: string
	error_message: string
	is_case_sensitive?: boolean
}

export interface Resource {
	id: string
	title: string
	type: 'article' | 'video' | 'tool' | 'documentation' | 'book' | 'course'
	url: string
	description?: string
	is_external: boolean
	difficulty?: DifficultyLevel
	estimated_read_time?: number
}

export interface Exercise {
	id: string
	title: string
	description: string
	type: ExerciseType
	content: ExerciseContent
	solution?: ExerciseSolution
	hints: string[]
	points: number
	time_limit_minutes?: number
}

export interface ExerciseContent {
	prompt: string
	starter_code?: string
	test_cases?: TestCase[]
	expected_output?: string
	tools_needed?: string[]
	constraints?: string[]
}

export interface ExerciseSolution {
	explanation: string
	code?: string
	steps: string[]
	alternative_approaches?: string[]
}

export interface TestCase {
	input: Record<string, unknown>
	expected_output: Record<string, unknown>
	description: string
	is_hidden?: boolean
}

export interface Quiz {
	id: string
	title: string
	description?: string
	questions: QuizQuestion[]
	passing_score: number
	time_limit_minutes?: number
	max_attempts?: number
	shuffle_questions?: boolean
}

export interface QuizQuestion {
	id: string
	type: QuestionType
	question: string
	options?: QuizOption[]
	correct_answer: Record<string, unknown>
	explanation?: string
	points: number
	hints?: string[]
	media?: ContentBlock
}

export interface QuizOption {
	id: string
	text: string
	is_correct: boolean
	explanation?: string
}

export interface PracticalApplication {
	id: string
	title: string
	description: string
	scenario: string
	tasks: ApplicationTask[]
	success_criteria: string[]
	tools_provided: string[]
	estimated_completion_time: number
}

export interface ApplicationTask {
	id: string
	description: string
	type: 'prompt_engineering' | 'tool_usage' | 'analysis' | 'creation' | 'optimization'
	requirements: string[]
	deliverables: string[]
	evaluation_criteria: string[]
}

export interface LessonMetadata {
	ai_tools_featured: string[]
	concepts_covered: string[]
	industry_applications: string[]
	certification_relevant?: boolean
	peer_collaboration?: boolean
	real_world_examples: string[]
	updated_for_version?: string
}

export enum LessonType {
	INTERACTIVE_TUTORIAL = 'interactive_tutorial',
	VIDEO_LESSON = 'video_lesson',
	READING_MATERIAL = 'reading_material',
	HANDS_ON_EXERCISE = 'hands_on_exercise',
	QUIZ_ASSESSMENT = 'quiz_assessment',
	PROJECT_BASED = 'project_based',
	PEER_COLLABORATION = 'peer_collaboration',
	AI_SIMULATION = 'ai_simulation'
}

export enum DifficultyLevel {
	BEGINNER = 'beginner',
	INTERMEDIATE = 'intermediate',
	ADVANCED = 'advanced',
	EXPERT = 'expert'
}

export enum LessonStatus {
	DRAFT = 'draft',
	REVIEW = 'review',
	PUBLISHED = 'published',
	ARCHIVED = 'archived',
	UPDATED = 'updated'
}

export enum ExerciseType {
	PROMPT_WRITING = 'prompt_writing',
	TOOL_CONFIGURATION = 'tool_configuration',
	OUTPUT_ANALYSIS = 'output_analysis',
	WORKFLOW_DESIGN = 'workflow_design',
	ETHICAL_EVALUATION = 'ethical_evaluation',
	PERFORMANCE_OPTIMIZATION = 'performance_optimization'
}

export enum QuestionType {
	MULTIPLE_CHOICE = 'multiple_choice',
	SINGLE_CHOICE = 'single_choice',
	TRUE_FALSE = 'true_false',
	FILL_IN_BLANK = 'fill_in_blank',
	SHORT_ANSWER = 'short_answer',
	LONG_ANSWER = 'long_answer',
	CODE_COMPLETION = 'code_completion',
	DRAG_AND_DROP = 'drag_and_drop'
}

export interface LearningPath {
	id: string
	title: string
	description: string
	difficulty: DifficultyLevel
	estimated_duration_hours: number
	prerequisites: string[]
	learning_objectives: string[]
	target_audience: string[]
	lessons: string[] // Lesson IDs in order
	milestones: PathMilestone[]
	certification?: PathCertification
	tags: string[]
	is_featured: boolean
	created_at: string
	updated_at: string
}

export interface PathMilestone {
	id: string
	title: string
	description: string
	lessons_required: string[]
	reward_xp: number
	badge_id?: string
	unlock_requirements: string[]
}

export interface PathCertification {
	id: string
	name: string
	description: string
	requirements: CertificationRequirement[]
	validity_months?: number
	digital_badge_url?: string
	verification_url?: string
}

export interface CertificationRequirement {
	type: 'lessons_completed' | 'quiz_score' | 'project_submission' | 'peer_review'
	description: string
	target_value: number
	weight: number
} 