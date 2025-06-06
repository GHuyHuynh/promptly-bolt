'use client'

import { motion } from 'framer-motion'
import { Flame, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StreakCounterProps {
	streak: number
	maxStreak?: number
	isActive?: boolean
	className?: string
}

export function StreakCounter({ 
	streak, 
	maxStreak = 0, 
	isActive = true,
	className = '' 
}: StreakCounterProps) {
	const getStreakColor = () => {
		if (streak >= 30) return 'text-purple-500'
		if (streak >= 14) return 'text-blue-500'
		if (streak >= 7) return 'text-green-500'
		if (streak >= 3) return 'text-yellow-500'
		return 'text-orange-500'
	}

	const getFlameSize = () => {
		if (streak >= 30) return 'w-8 h-8'
		if (streak >= 14) return 'w-7 h-7'
		if (streak >= 7) return 'w-6 h-6'
		return 'w-5 h-5'
	}

	const getMilestone = () => {
		if (streak >= 30) return { text: 'Legendary!', color: 'text-purple-500' }
		if (streak >= 14) return { text: 'On Fire!', color: 'text-blue-500' }
		if (streak >= 7) return { text: 'Hot Streak!', color: 'text-green-500' }
		if (streak >= 3) return { text: 'Building!', color: 'text-yellow-500' }
		return { text: 'Getting Started', color: 'text-orange-500' }
	}

	const milestone = getMilestone()

	return (
		<div className={cn('flex flex-col items-center space-y-2', className)}>
			{/* Flame Icon with Animation */}
			<motion.div
				className="relative"
				animate={isActive ? {
					scale: [1, 1.1, 1],
					rotate: [0, 2, -2, 0]
				} : {}}
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: 'easeInOut'
				}}
			>
				<Flame 
					className={cn(
						getFlameSize(),
						getStreakColor(),
						isActive ? 'drop-shadow-lg' : 'opacity-50'
					)} 
				/>
				
				{/* Glow Effect */}
				{isActive && streak > 0 && (
					<motion.div
						className={cn(
							'absolute inset-0 rounded-full blur-md opacity-30',
							getStreakColor().replace('text-', 'bg-')
						)}
						animate={{
							scale: [1, 1.2, 1],
							opacity: [0.3, 0.6, 0.3]
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: 'easeInOut'
						}}
					/>
				)}
			</motion.div>

			{/* Streak Number */}
			<motion.div
				className="text-center"
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ type: 'spring', stiffness: 260, damping: 20 }}
			>
				<div className={cn('text-2xl font-bold', getStreakColor())}>
					{streak}
				</div>
				<div className="text-xs text-gray-500 font-medium">
					day{streak !== 1 ? 's' : ''}
				</div>
			</motion.div>

			{/* Milestone Text */}
			<motion.div
				className={cn('text-xs font-semibold', milestone.color)}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				{milestone.text}
			</motion.div>

			{/* Personal Best Indicator */}
			{maxStreak > 0 && streak === maxStreak && (
				<motion.div
					className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.5, type: 'spring' }}
				>
					<Calendar className="w-3 h-3" />
					Personal Best!
				</motion.div>
			)}

			{/* Progress to Next Milestone */}
			{streak < 30 && (
				<div className="w-full max-w-[120px]">
					<div className="flex justify-between text-xs text-gray-400 mb-1">
						<span>{streak}</span>
						<span>
							{streak < 3 ? 3 : streak < 7 ? 7 : streak < 14 ? 14 : 30}
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-1">
						<motion.div
							className={cn(
								'h-1 rounded-full transition-all duration-500',
								getStreakColor().replace('text-', 'bg-')
							)}
							initial={{ width: 0 }}
							animate={{ 
								width: `${Math.min(
									(streak / (streak < 3 ? 3 : streak < 7 ? 7 : streak < 14 ? 14 : 30)) * 100,
									100
								)}%` 
							}}
							transition={{ duration: 1, delay: 0.8 }}
						/>
					</div>
				</div>
			)}
		</div>
	)
} 