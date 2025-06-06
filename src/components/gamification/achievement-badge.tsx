'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Lock, Star } from 'lucide-react'

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Achievement {
	id: string
	title: string
	description: string
	icon: string
	earned: boolean
	earnedAt?: string
	rarity: AchievementRarity
}

interface AchievementBadgeProps {
	achievement: Achievement
	size?: 'sm' | 'md' | 'lg'
	showDescription?: boolean
	onClick?: () => void
}

const rarityColors = {
	common: {
		bg: 'bg-gray-100 dark:bg-gray-800',
		border: 'border-gray-300 dark:border-gray-600',
		text: 'text-gray-700 dark:text-gray-300',
		badge: 'bg-gray-500'
	},
	rare: {
		bg: 'bg-blue-50 dark:bg-blue-950/20',
		border: 'border-blue-300 dark:border-blue-600',
		text: 'text-blue-700 dark:text-blue-300',
		badge: 'bg-blue-500'
	},
	epic: {
		bg: 'bg-purple-50 dark:bg-purple-950/20',
		border: 'border-purple-300 dark:border-purple-600',
		text: 'text-purple-700 dark:text-purple-300',
		badge: 'bg-purple-500'
	},
	legendary: {
		bg: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20',
		border: 'border-gradient-to-r from-yellow-400 to-orange-400',
		text: 'text-yellow-700 dark:text-yellow-300',
		badge: 'bg-gradient-to-r from-yellow-500 to-orange-500'
	}
}

const sizeClasses = {
	sm: {
		card: 'p-3',
		icon: 'text-2xl',
		title: 'text-sm font-medium',
		description: 'text-xs',
		badge: 'text-xs'
	},
	md: {
		card: 'p-4',
		icon: 'text-3xl',
		title: 'text-base font-semibold',
		description: 'text-sm',
		badge: 'text-xs'
	},
	lg: {
		card: 'p-6',
		icon: 'text-4xl',
		title: 'text-lg font-bold',
		description: 'text-base',
		badge: 'text-sm'
	}
}

export function AchievementBadge({ 
	achievement, 
	size = 'md', 
	showDescription = true,
	onClick 
}: AchievementBadgeProps) {
	const colors = rarityColors[achievement.rarity]
	const sizes = sizeClasses[size]
	
	const isEarned = achievement.earned
	const isLegendary = achievement.rarity === 'legendary'

	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			className={onClick ? 'cursor-pointer' : ''}
			onClick={onClick}
		>
			<Card 
				className={`
					relative overflow-hidden transition-all duration-300
					${isEarned ? colors.bg : 'bg-muted/50'}
					${isEarned ? colors.border : 'border-muted'}
					${isEarned ? 'shadow-sm hover:shadow-md' : ''}
					${isLegendary && isEarned ? 'animate-pulse' : ''}
				`}
			>
				{/* Legendary glow effect */}
				{isLegendary && isEarned && (
					<div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse" />
				)}
				
				<CardContent className={sizes.card}>
					<div className="flex items-start gap-3">
						{/* Icon */}
						<div className="relative flex-shrink-0">
							<div 
								className={`
									flex items-center justify-center w-12 h-12 rounded-full
									${isEarned ? 'bg-background' : 'bg-muted'}
									${isEarned ? colors.border : 'border-muted'}
									border-2
								`}
							>
								{isEarned ? (
									<span className={sizes.icon}>{achievement.icon}</span>
								) : (
									<Lock className="h-5 w-5 text-muted-foreground" />
								)}
							</div>
							
							{/* Rarity indicator */}
							{isEarned && (
								<div className="absolute -top-1 -right-1">
									<div 
										className={`
											flex items-center justify-center w-5 h-5 rounded-full
											${colors.badge}
											text-white
										`}
									>
										<Star className="h-3 w-3 fill-current" />
									</div>
								</div>
							)}
						</div>

						{/* Content */}
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between gap-2">
								<div className="flex-1">
									<h3 
										className={`
											${sizes.title}
											${isEarned ? colors.text : 'text-muted-foreground'}
										`}
									>
										{achievement.title}
									</h3>
									
									{showDescription && (
										<p 
											className={`
												${sizes.description}
												${isEarned ? 'text-muted-foreground' : 'text-muted-foreground/70'}
												mt-1
											`}
										>
											{achievement.description}
										</p>
									)}
									
									{/* Earned date */}
									{isEarned && achievement.earnedAt && (
										<p className="text-xs text-muted-foreground mt-2">
											Earned {new Date(achievement.earnedAt).toLocaleDateString()}
										</p>
									)}
								</div>
								
								{/* Rarity badge */}
								<Badge 
									variant={isEarned ? 'default' : 'secondary'}
									className={`
										${sizes.badge}
										${isEarned ? colors.badge : 'bg-muted'}
										${isEarned ? 'text-white' : 'text-muted-foreground'}
										capitalize
									`}
								>
									{achievement.rarity}
								</Badge>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
}

// Grid component for displaying multiple achievements
interface AchievementGridProps {
	achievements: Achievement[]
	size?: 'sm' | 'md' | 'lg'
	columns?: number
	onAchievementClick?: (achievement: Achievement) => void
}

export function AchievementGrid({ 
	achievements, 
	size = 'md', 
	columns = 3,
	onAchievementClick 
}: AchievementGridProps) {
	const gridCols = {
		1: 'grid-cols-1',
		2: 'grid-cols-1 md:grid-cols-2',
		3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
		4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
	}

	return (
		<div className={`grid gap-4 ${gridCols[columns as keyof typeof gridCols] || gridCols[3]}`}>
			{achievements.map((achievement) => (
				<AchievementBadge
					key={achievement.id}
					achievement={achievement}
					size={size}
					onClick={onAchievementClick ? () => onAchievementClick(achievement) : undefined}
				/>
			))}
		</div>
	)
} 