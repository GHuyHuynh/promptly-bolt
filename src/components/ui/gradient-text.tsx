'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GradientTextProps {
	children: React.ReactNode
	className?: string
	variant?: 'primary' | 'secondary' | 'ai' | 'success'
	animated?: boolean
}

const variants = {
	primary: 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600',
	secondary: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
	ai: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600',
	success: 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500'
}

export function GradientText({ 
	children, 
	className = '', 
	variant = 'primary',
	animated = false 
}: GradientTextProps) {
	return (
		<motion.span
			className={cn(
				'bg-clip-text text-transparent font-bold',
				variants[variant],
				animated && 'animate-pulse',
				className
			)}
			initial={animated ? { opacity: 0, y: 20 } : undefined}
			animate={animated ? { opacity: 1, y: 0 } : undefined}
			transition={animated ? { duration: 0.6, ease: 'easeOut' } : undefined}
		>
			{children}
		</motion.span>
	)
} 