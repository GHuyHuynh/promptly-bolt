'use client'

import { motion } from 'framer-motion'
import { Check, Lock, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SkillNodeData {
	id: string
	title: string
	description: string
	status: 'locked' | 'available' | 'in-progress' | 'completed'
	progress?: number
	icon?: React.ComponentType<{ className?: string }>
	difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
	xpReward: number
	prerequisites?: string[]
}

interface SkillNodeProps {
	node: SkillNodeData
	position: { x: number; y: number }
	isHighlighted?: boolean
	onHover?: (nodeId: string | null) => void
	onClick?: (nodeId: string) => void
}

const statusColors = {
	locked: 'bg-gray-600 border-gray-500 text-gray-400',
	available: 'bg-blue-600 border-blue-500 text-white hover:bg-blue-700',
	'in-progress': 'bg-yellow-600 border-yellow-500 text-white hover:bg-yellow-700',
	completed: 'bg-green-600 border-green-500 text-white hover:bg-green-700'
}

const difficultyColors = {
	beginner: 'bg-green-100 text-green-800',
	intermediate: 'bg-yellow-100 text-yellow-800',
	advanced: 'bg-orange-100 text-orange-800',
	expert: 'bg-red-100 text-red-800'
}

export function SkillNode({ 
	node, 
	position, 
	isHighlighted = false, 
	onHover, 
	onClick 
}: SkillNodeProps) {
	const IconComponent = node.icon

	const getStatusIcon = () => {
		switch (node.status) {
			case 'locked':
				return <Lock className="w-4 h-4" />
			case 'completed':
				return <Check className="w-4 h-4" />
			case 'in-progress':
				return <Play className="w-4 h-4" />
			default:
				return IconComponent ? <IconComponent className="w-4 h-4" /> : <Play className="w-4 h-4" />
		}
	}

	return (
		<motion.div
			className="absolute transform -translate-x-1/2 -translate-y-1/2"
			style={{ left: position.x, top: position.y }}
			initial={{ scale: 0, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			whileHover={{ scale: 1.1 }}
			onHoverStart={() => onHover?.(node.id)}
			onHoverEnd={() => onHover?.(null)}
			onClick={() => onClick?.(node.id)}
		>
			{/* Node Circle */}
			<motion.div
				className={cn(
					'relative w-16 h-16 rounded-full border-2 cursor-pointer transition-all duration-200',
					statusColors[node.status],
					isHighlighted && 'ring-4 ring-blue-300 ring-opacity-50',
					node.status !== 'locked' && 'shadow-lg hover:shadow-xl'
				)}
				whileTap={{ scale: 0.95 }}
			>
				{/* Progress Ring for in-progress nodes */}
				{node.status === 'in-progress' && node.progress && (
					<svg className="absolute inset-0 w-full h-full transform -rotate-90">
						<circle
							cx="32"
							cy="32"
							r="30"
							stroke="currentColor"
							strokeWidth="2"
							fill="none"
							className="opacity-20"
						/>
						<circle
							cx="32"
							cy="32"
							r="30"
							stroke="currentColor"
							strokeWidth="2"
							fill="none"
							strokeDasharray={`${2 * Math.PI * 30}`}
							strokeDashoffset={`${2 * Math.PI * 30 * (1 - node.progress / 100)}`}
							className="transition-all duration-500"
						/>
					</svg>
				)}

				{/* Icon */}
				<div className="absolute inset-0 flex items-center justify-center">
					{getStatusIcon()}
				</div>
			</motion.div>

			{/* Node Info Tooltip */}
			<motion.div
				className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 pointer-events-none"
				animate={{ 
					opacity: isHighlighted ? 1 : 0,
					y: isHighlighted ? 0 : 10
				}}
				transition={{ duration: 0.2 }}
			>
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-[200px] border">
					<h3 className="font-semibold text-sm mb-1">{node.title}</h3>
					<p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
						{node.description}
					</p>
					<div className="flex items-center justify-between text-xs">
						<span className={cn(
							'px-2 py-1 rounded-full font-medium',
							difficultyColors[node.difficulty]
						)}>
							{node.difficulty}
						</span>
						<span className="text-purple-600 font-medium">
							{node.xpReward} XP
						</span>
					</div>
					{node.status === 'in-progress' && node.progress && (
						<div className="mt-2">
							<div className="text-xs text-gray-600 mb-1">
								Progress: {node.progress}%
							</div>
							<div className="w-full bg-gray-200 rounded-full h-1">
								<div 
									className="bg-blue-600 h-1 rounded-full transition-all duration-500"
									style={{ width: `${node.progress}%` }}
								/>
							</div>
						</div>
					)}
				</div>
			</motion.div>
		</motion.div>
	)
} 