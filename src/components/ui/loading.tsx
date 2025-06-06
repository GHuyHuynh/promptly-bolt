'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingProps {
	variant?: 'spinner' | 'dots' | 'pulse' | 'brain' | 'bars'
	size?: 'sm' | 'md' | 'lg'
	text?: string
	className?: string
	fullScreen?: boolean
}

const sizeClasses = {
	sm: 'w-4 h-4',
	md: 'w-6 h-6',
	lg: 'w-8 h-8'
}

const textSizeClasses = {
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg'
}

export function Loading({ 
	variant = 'spinner', 
	size = 'md', 
	text, 
	className,
	fullScreen = false 
}: LoadingProps) {
	const containerClasses = cn(
		'flex flex-col items-center justify-center gap-3',
		fullScreen && 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50',
		className
	)

	const renderSpinner = () => (
		<Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
	)

	const renderDots = () => (
		<div className="flex space-x-1">
			{[0, 1, 2].map((i) => (
				<motion.div
					key={i}
					className={cn('bg-primary rounded-full', {
						'w-2 h-2': size === 'sm',
						'w-3 h-3': size === 'md',
						'w-4 h-4': size === 'lg'
					})}
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.7, 1, 0.7]
					}}
					transition={{
						duration: 0.6,
						repeat: Infinity,
						delay: i * 0.2
					}}
				/>
			))}
		</div>
	)

	const renderPulse = () => (
		<motion.div
			className={cn('bg-primary rounded-full', sizeClasses[size])}
			animate={{
				scale: [1, 1.2, 1],
				opacity: [0.7, 1, 0.7]
			}}
			transition={{
				duration: 1,
				repeat: Infinity
			}}
		/>
	)

	const renderBrain = () => (
		<motion.div
			animate={{
				rotate: [0, 360]
			}}
			transition={{
				duration: 2,
				repeat: Infinity,
				ease: 'linear'
			}}
		>
			<Loader2 className={cn('text-primary', sizeClasses[size])} />
		</motion.div>
	)

	const renderBars = () => (
		<div className="flex items-end space-x-1">
			{[0, 1, 2, 3].map((i) => (
				<motion.div
					key={i}
					className={cn('bg-primary', {
						'w-1': size === 'sm',
						'w-1.5': size === 'md',
						'w-2': size === 'lg'
					})}
					style={{
						height: size === 'sm' ? '12px' : size === 'md' ? '16px' : '20px'
					}}
					animate={{
						scaleY: [0.4, 1, 0.4]
					}}
					transition={{
						duration: 0.8,
						repeat: Infinity,
						delay: i * 0.1
					}}
				/>
			))}
		</div>
	)

	const renderVariant = () => {
		switch (variant) {
			case 'dots':
				return renderDots()
			case 'pulse':
				return renderPulse()
			case 'brain':
				return renderBrain()
			case 'bars':
				return renderBars()
			default:
				return renderSpinner()
		}
	}

	return (
		<div className={containerClasses}>
			{renderVariant()}
			{text && (
				<motion.p
					className={cn('text-muted-foreground font-medium', textSizeClasses[size])}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
				>
					{text}
				</motion.p>
			)}
		</div>
	)
}

// Skeleton loading components
interface SkeletonProps {
	className?: string
	variant?: 'text' | 'circular' | 'rectangular'
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
	const baseClasses = 'animate-pulse bg-muted'
	
	const variantClasses = {
		text: 'h-4 rounded',
		circular: 'rounded-full',
		rectangular: 'rounded'
	}

	return (
		<div className={cn(baseClasses, variantClasses[variant], className)} />
	)
}

// Page loading component
export function PageLoading() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<Loading 
				variant="brain" 
				size="lg" 
				text="Loading your AI learning experience..."
			/>
		</div>
	)
}

// Card loading skeleton
export function CardSkeleton() {
	return (
		<div className="p-6 space-y-4">
			<Skeleton className="h-6 w-3/4" variant="text" />
			<Skeleton className="h-4 w-full" variant="text" />
			<Skeleton className="h-4 w-2/3" variant="text" />
			<div className="flex space-x-2">
				<Skeleton className="h-8 w-16" />
				<Skeleton className="h-8 w-20" />
			</div>
		</div>
	)
}

// Button loading state
interface ButtonLoadingProps {
	children: React.ReactNode
	isLoading?: boolean
	loadingText?: string
}

export function ButtonLoading({ children, isLoading, loadingText }: ButtonLoadingProps) {
	if (isLoading) {
		return (
			<div className="flex items-center gap-2">
				<Loading variant="spinner" size="sm" />
				{loadingText || 'Loading...'}
			</div>
		)
	}
	
	return <>{children}</>
} 