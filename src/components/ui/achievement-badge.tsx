'use client'

import { motion } from 'framer-motion'
import { Trophy, Star, Crown, Gem } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Achievement {
	id: string
	title: string
	description: string
	icon?: React.ComponentType<{ className?: string }>
	rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
	unlockedAt?: Date
	progress?: number
	maxProgress?: number
}

interface AchievementBadgeProps {
	achievement: Achievement
	size?: 'sm' | 'md' | 'lg'
	showTooltip?: boolean
	className?: string
}

const rarityConfig = {
	common: {
		bg: 'bg-gray-100 border-gray-300',
		icon: 'text-gray-600',
		glow: 'shadow-gray-200',
		name: 'Common'
	},
	uncommon: {
		bg: 'bg-green-100 border-green-300',
		icon: 'text-green-600',
		glow: 'shadow-green-200',
		name: 'Uncommon'
	},
	rare: {
		bg: 'bg-blue-100 border-blue-300',
		icon: 'text-blue-600',
		glow: 'shadow-blue-200',
		name: 'Rare'
	},
	epic: {
		bg: 'bg-purple-100 border-purple-300',
		icon: 'text-purple-600',
		glow: 'shadow-purple-200',
		name: 'Epic'
	},
	legendary: {
		bg: 'bg-yellow-100 border-yellow-300',
		icon: 'text-yellow-600',
		glow: 'shadow-yellow-200',
		name: 'Legendary'
	}
}

const sizeConfig = {
	sm: { container: 'w-12 h-12', icon: 'w-6 h-6' },
	md: { container: 'w-16 h-16', icon: 'w-8 h-8' },
	lg: { container: 'w-20 h-20', icon: 'w-10 h-10' }
}

export function AchievementBadge({ 
	achievement, 
	size = 'md', 
	showTooltip = true,
	className = '' 
}: AchievementBadgeProps) {
	const config = rarityConfig[achievement.rarity]
	const sizeClasses = sizeConfig[size]
	const IconComponent = achievement.icon || Trophy
	const isUnlocked = !!achievement.unlockedAt

	const getRarityIcon = () => {
		switch (achievement.rarity) {
			case 'legendary':
				return Crown
			case 'epic':
				return Gem
			case 'rare':
				return Star
			default:
				return Trophy
		}
	}

	const RarityIcon = getRarityIcon()

	return (
		<div className={cn('relative group', className)}>
			<motion.div
				className={cn(
					'relative rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200',
					sizeClasses.container,
					config.bg,
					config.glow,
					isUnlocked ? 'opacity-100' : 'opacity-50 grayscale'
				)}
				whileHover={isUnlocked ? { scale: 1.1, rotate: 5 } : {}}
				whileTap={isUnlocked ? { scale: 0.95 } : {}}
				initial={{ scale: 0, rotate: -180 }}
				animate={{ scale: 1, rotate: 0 }}
				transition={{ 
					type: 'spring', 
					stiffness: 260, 
					damping: 20,
					delay: Math.random() * 0.5 
				}}
			>
				{/* Main Icon */}
				<IconComponent className={cn(sizeClasses.icon, config.icon)} />

				{/* Rarity Indicator */}
				<div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm">
					<RarityIcon className="w-3 h-3 text-gray-600" />
				</div>

				{/* Unlock Animation */}
				{isUnlocked && (
					<motion.div
						className="absolute inset-0 rounded-full border-2 border-current opacity-50"
						initial={{ scale: 1, opacity: 0.5 }}
						animate={{ scale: 1.5, opacity: 0 }}
						transition={{ duration: 2, repeat: Infinity }}
					/>
				)}

				{/* Progress Ring (for partially completed achievements) */}
				{!isUnlocked && achievement.progress && achievement.maxProgress && (
					<svg className="absolute inset-0 w-full h-full transform -rotate-90">
						<circle
							cx="50%"
							cy="50%"
							r="45%"
							stroke="currentColor"
							strokeWidth="2"
							fill="none"
							className="opacity-20"
						/>
						<circle
							cx="50%"
							cy="50%"
							r="45%"
							stroke="currentColor"
							strokeWidth="2"
							fill="none"
							strokeDasharray={`${2 * Math.PI * 45}`}
							strokeDashoffset={`${2 * Math.PI * 45 * (1 - achievement.progress / achievement.maxProgress)}`}
							className="transition-all duration-500"
						/>
					</svg>
				)}
			</motion.div>

			{/* Tooltip */}
			{showTooltip && (
				<motion.div
					className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200"
					initial={false}
				>
					<div className="bg-black text-white text-xs rounded-lg p-3 min-w-[200px] shadow-lg">
						<div className="flex items-center gap-2 mb-1">
							<span className="font-semibold">{achievement.title}</span>
							<span className={cn(
								'px-2 py-0.5 rounded-full text-xs font-medium',
								config.bg,
								config.icon
							)}>
								{config.name}
							</span>
						</div>
						<p className="text-gray-300 mb-2">{achievement.description}</p>
						
						{isUnlocked ? (
							<p className="text-green-400 text-xs">
								Unlocked {achievement.unlockedAt?.toLocaleDateString()}
							</p>
						) : achievement.progress && achievement.maxProgress ? (
							<div>
								<p className="text-gray-400 text-xs mb-1">
									Progress: {achievement.progress}/{achievement.maxProgress}
								</p>
								<div className="w-full bg-gray-700 rounded-full h-1">
									<div 
										className="bg-blue-500 h-1 rounded-full transition-all duration-500"
										style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
									/>
								</div>
							</div>
						) : (
							<p className="text-gray-400 text-xs">Not unlocked</p>
						)}

						{/* Tooltip Arrow */}
						<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black" />
					</div>
				</motion.div>
			)}
		</div>
	)
} 