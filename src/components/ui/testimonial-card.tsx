'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Testimonial {
	id: string
	name: string
	role: string
	company: string
	avatar?: string
	content: string
	rating: number
	beforeSkill?: string
	afterSkill?: string
	coursesCompleted?: number
	timeframe?: string
}

interface TestimonialCardProps {
	testimonial: Testimonial
	variant?: 'default' | 'featured' | 'compact'
	className?: string
}

export function TestimonialCard({ 
	testimonial, 
	variant = 'default',
	className = '' 
}: TestimonialCardProps) {
	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				className={cn(
					'w-4 h-4',
					i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
				)}
			/>
		))
	}

	const cardContent = (
		<>
			{/* Quote Icon */}
			{variant === 'featured' && (
				<div className="absolute top-4 right-4 text-blue-500/20">
					<Quote className="w-8 h-8" />
				</div>
			)}

			{/* Rating */}
			<div className="flex items-center gap-1 mb-4">
				{renderStars(testimonial.rating)}
				<span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
					({testimonial.rating}/5)
				</span>
			</div>

			{/* Content */}
			<blockquote className={cn(
				'text-gray-700 dark:text-gray-300 mb-6 leading-relaxed',
				variant === 'featured' ? 'text-lg' : 'text-base',
				variant === 'compact' && 'text-sm mb-4'
			)}>
				&ldquo;{testimonial.content}&rdquo;
			</blockquote>

			{/* Before/After Skills */}
			{testimonial.beforeSkill && testimonial.afterSkill && (
				<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
					<div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
						AI Skills Progress:
					</div>
					<div className="flex items-center gap-4">
						<div className="text-center">
							<div className="text-xs text-gray-500">Before</div>
							<div className="font-semibold text-red-600">{testimonial.beforeSkill}</div>
						</div>
						<div className="flex-1 border-t border-dashed border-gray-300" />
						<div className="text-center">
							<div className="text-xs text-gray-500">After</div>
							<div className="font-semibold text-green-600">{testimonial.afterSkill}</div>
						</div>
					</div>
					{testimonial.timeframe && (
						<div className="text-xs text-gray-500 text-center mt-2">
							in {testimonial.timeframe}
						</div>
					)}
				</div>
			)}

			{/* User Info */}
			<div className="flex items-center gap-3">
				<Avatar className={cn(
					variant === 'featured' ? 'w-12 h-12' : 'w-10 h-10'
				)}>
					<AvatarImage src={testimonial.avatar} alt={testimonial.name} />
					<AvatarFallback className="font-semibold">
						{testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1">
					<h4 className={cn(
						'font-semibold',
						variant === 'featured' ? 'text-lg' : 'text-base'
					)}>
						{testimonial.name}
					</h4>
					<p className={cn(
						'text-gray-600 dark:text-gray-400',
						variant === 'compact' ? 'text-xs' : 'text-sm'
					)}>
						{testimonial.role} at {testimonial.company}
					</p>
					{testimonial.coursesCompleted && (
						<p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
							Completed {testimonial.coursesCompleted} courses
						</p>
					)}
				</div>
			</div>
		</>
	)

	const cardClasses = cn(
		'bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300',
		variant === 'featured' && 'p-8 shadow-xl border-2 border-blue-200 dark:border-blue-800',
		variant === 'default' && 'p-6 hover:shadow-xl hover:scale-105',
		variant === 'compact' && 'p-4 hover:shadow-lg',
		className
	)

	if (variant === 'featured') {
		return (
			<motion.div
				className={cardClasses}
				initial={{ opacity: 0, scale: 0.95 }}
				whileInView={{ opacity: 1, scale: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
			>
				<div className="relative">
					{cardContent}
				</div>
			</motion.div>
		)
	}

	return (
		<motion.div
			className={cardClasses}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			whileHover={{ y: -5 }}
		>
			{cardContent}
		</motion.div>
	)
} 