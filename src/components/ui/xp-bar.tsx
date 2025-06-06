'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

interface XPBarProps {
	currentXP: number
	maxXP: number
	level: number
	animated?: boolean
	showLabel?: boolean
	className?: string
}

export function XPBar({ 
	currentXP, 
	maxXP, 
	level, 
	animated = true, 
	showLabel = true,
	className = '' 
}: XPBarProps) {
	const percentage = Math.min((currentXP / maxXP) * 100, 100)
	const xpToNext = maxXP - currentXP

	return (
		<div className={`space-y-2 ${className}`}>
			{showLabel && (
				<div className="flex items-center justify-between text-sm">
					<div className="flex items-center gap-2">
						<Zap className="w-4 h-4 text-yellow-500" />
						<span className="font-semibold">Level {level}</span>
					</div>
					<span className="text-gray-600 dark:text-gray-400">
						{currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
					</span>
				</div>
			)}
			
			<div className="relative">
				{/* Background Bar */}
				<div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
					{/* XP Fill */}
					<motion.div
						className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-full relative"
						initial={animated ? { width: 0 } : { width: `${percentage}%` }}
						animate={{ width: `${percentage}%` }}
						transition={{ duration: animated ? 1.5 : 0, ease: 'easeOut', delay: animated ? 0.2 : 0 }}
					>
						{/* Shine Effect */}
						<motion.div
							className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
							initial={{ x: '-100%' }}
							animate={{ x: '100%' }}
							transition={{
								duration: 2,
								repeat: Infinity,
								repeatDelay: 3,
								ease: 'easeInOut'
							}}
						/>
					</motion.div>
				</div>

				{/* Level Badge */}
				<motion.div
					className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg"
					initial={animated ? { scale: 0, rotate: -180 } : { scale: 1, rotate: 0 }}
					animate={{ scale: 1, rotate: 0 }}
					transition={{ duration: 0.5, delay: animated ? 1.2 : 0 }}
				>
					{level}
				</motion.div>
			</div>

			{showLabel && xpToNext > 0 && (
				<motion.p
					className="text-xs text-gray-500 text-center"
					initial={animated ? { opacity: 0 } : { opacity: 1 }}
					animate={{ opacity: 1 }}
					transition={{ delay: animated ? 1.5 : 0 }}
				>
					{xpToNext.toLocaleString()} XP to level {level + 1}
				</motion.p>
			)}
		</div>
	)
} 