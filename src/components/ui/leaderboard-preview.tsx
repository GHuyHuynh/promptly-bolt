'use client'

import { motion } from 'framer-motion'
import { Crown, Medal, Award, TrendingUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface LeaderboardUser {
	id: string
	name: string
	avatar?: string
	xp: number
	level: number
	rank: number
	trend?: 'up' | 'down' | 'same'
}

interface LeaderboardPreviewProps {
	users: LeaderboardUser[]
	currentUser?: LeaderboardUser
	showTrends?: boolean
	className?: string
}

const getRankIcon = (rank: number) => {
	switch (rank) {
		case 1:
			return { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-50' }
		case 2:
			return { icon: Medal, color: 'text-gray-500', bg: 'bg-gray-50' }
		case 3:
			return { icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' }
		default:
			return { icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' }
	}
}

const getTrendColor = (trend?: string) => {
	switch (trend) {
		case 'up':
			return 'text-green-500'
		case 'down':
			return 'text-red-500'
		default:
			return 'text-gray-400'
	}
}

export function LeaderboardPreview({ 
	users, 
	currentUser, 
	showTrends = true,
	className = '' 
}: LeaderboardPreviewProps) {
	return (
		<div className={cn('bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg', className)}>
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-lg font-bold">Weekly Leaderboard</h3>
				<div className="text-sm text-gray-500">
					Resets in 3 days
				</div>
			</div>

			<div className="space-y-3">
				{users.slice(0, 5).map((user, index) => {
					const rankConfig = getRankIcon(user.rank)
					const RankIcon = rankConfig.icon
					const isCurrentUser = currentUser?.id === user.id

					return (
						<motion.div
							key={user.id}
							className={cn(
								'flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
								isCurrentUser 
									? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
									: 'hover:bg-gray-50 dark:hover:bg-gray-700'
							)}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.1 }}
							whileHover={{ scale: 1.02 }}
						>
							{/* Rank */}
							<div className={cn(
								'flex items-center justify-center w-8 h-8 rounded-full',
								rankConfig.bg
							)}>
								{user.rank <= 3 ? (
									<RankIcon className={cn('w-4 h-4', rankConfig.color)} />
								) : (
									<span className="text-sm font-bold text-gray-600">
										{user.rank}
									</span>
								)}
							</div>

							{/* Avatar */}
							<motion.div
								whileHover={{ scale: 1.1 }}
								transition={{ type: 'spring', stiffness: 400, damping: 10 }}
							>
								<Avatar className="w-10 h-10">
									<AvatarImage src={user.avatar} alt={user.name} />
									<AvatarFallback className="text-sm font-semibold">
										{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</motion.div>

							{/* User Info */}
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<h4 className={cn(
										'font-semibold text-sm truncate',
										isCurrentUser && 'text-blue-600 dark:text-blue-400'
									)}>
										{user.name}
										{isCurrentUser && (
											<span className="text-xs ml-1">(You)</span>
										)}
									</h4>
									{showTrends && user.trend && (
										<motion.div
											className={cn('text-xs', getTrendColor(user.trend))}
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ delay: 0.5 + index * 0.1 }}
										>
											{user.trend === 'up' && '↗'}
											{user.trend === 'down' && '↘'}
											{user.trend === 'same' && '→'}
										</motion.div>
									)}
								</div>
								<div className="text-xs text-gray-500">
									Level {user.level}
								</div>
							</div>

							{/* XP */}
							<div className="text-right">
								<div className="font-bold text-sm">
									{user.xp.toLocaleString()}
								</div>
								<div className="text-xs text-gray-500">XP</div>
							</div>
						</motion.div>
					)
				})}
			</div>

			{/* Current User Position (if not in top 5) */}
			{currentUser && !users.slice(0, 5).find(u => u.id === currentUser.id) && (
				<motion.div
					className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.8 }}
				>
					<div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
						<div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800">
							<span className="text-sm font-bold text-blue-600 dark:text-blue-400">
								{currentUser.rank}
							</span>
						</div>

						<Avatar className="w-10 h-10">
							<AvatarImage src={currentUser.avatar} alt={currentUser.name} />
							<AvatarFallback className="text-sm font-semibold">
								{currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
							</AvatarFallback>
						</Avatar>

						<div className="flex-1 min-w-0">
							<h4 className="font-semibold text-sm text-blue-600 dark:text-blue-400">
								{currentUser.name} (You)
							</h4>
							<div className="text-xs text-gray-500">
								Level {currentUser.level}
							</div>
						</div>

						<div className="text-right">
							<div className="font-bold text-sm">
								{currentUser.xp.toLocaleString()}
							</div>
							<div className="text-xs text-gray-500">XP</div>
						</div>
					</div>
				</motion.div>
			)}

			{/* View Full Leaderboard Link */}
			<motion.div
				className="mt-4 text-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1 }}
			>
				<button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
					View Full Leaderboard →
				</button>
			</motion.div>
		</div>
	)
} 