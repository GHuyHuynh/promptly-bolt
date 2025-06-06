'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

interface AnimatedCounterProps {
	from: number
	to: number
	duration?: number
	delay?: number
	className?: string
	suffix?: string
	prefix?: string
}

export function AnimatedCounter({
	from,
	to,
	duration = 2,
	delay = 0,
	className = '',
	suffix = '',
	prefix = ''
}: AnimatedCounterProps) {
	const count = useMotionValue(from)
	const rounded = useTransform(count, (latest) => Math.round(latest))
	const [displayValue, setDisplayValue] = useState(from)

	useEffect(() => {
		const timer = setTimeout(() => {
			const controls = animate(count, to, {
				duration,
				ease: 'easeOut'
			})

			const unsubscribe = rounded.on('change', (latest) => {
				setDisplayValue(latest)
			})

			return () => {
				controls.stop()
				unsubscribe()
			}
		}, delay * 1000)

		return () => clearTimeout(timer)
	}, [count, rounded, to, duration, delay])

	return (
		<motion.span
			className={className}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: delay * 0.5 }}
		>
			{prefix}
			{displayValue.toLocaleString()}
			{suffix}
		</motion.span>
	)
} 