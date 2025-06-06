'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { 
	Brain, 
	Zap, 
	Target, 
	Sparkles, 
	Lightbulb, 
	Code, 
	Cpu, 
	Bot,
	Rocket,
	Trophy
} from 'lucide-react'

const icons = [
	{ Icon: Brain, color: 'text-purple-400' },
	{ Icon: Zap, color: 'text-yellow-400' },
	{ Icon: Target, color: 'text-blue-400' },
	{ Icon: Sparkles, color: 'text-pink-400' },
	{ Icon: Lightbulb, color: 'text-orange-400' },
	{ Icon: Code, color: 'text-green-400' },
	{ Icon: Cpu, color: 'text-cyan-400' },
	{ Icon: Bot, color: 'text-violet-400' },
	{ Icon: Rocket, color: 'text-red-400' },
	{ Icon: Trophy, color: 'text-amber-400' }
]

interface FloatingElementsProps {
	className?: string
	count?: number
}

export function FloatingElements({ className = '', count = 8 }: FloatingElementsProps) {
	const [mounted, setMounted] = useState(false)
	const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
	const selectedIcons = icons.slice(0, count)

	useEffect(() => {
		setMounted(true)
		if (typeof window !== 'undefined') {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight
			})

			const handleResize = () => {
				setDimensions({
					width: window.innerWidth,
					height: window.innerHeight
				})
			}

			window.addEventListener('resize', handleResize)
			return () => window.removeEventListener('resize', handleResize)
		}
	}, [])

	if (!mounted) {
		return null
	}

	return (
		<div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
			{selectedIcons.map(({ Icon, color }, index) => (
				<motion.div
					key={index}
					className={`absolute ${color} opacity-20`}
					initial={{
						x: Math.random() * dimensions.width,
						y: Math.random() * dimensions.height,
						scale: 0,
						rotate: 0
					}}
					animate={{
						x: [
							Math.random() * (dimensions.width * 0.8),
							Math.random() * (dimensions.width * 0.8),
							Math.random() * (dimensions.width * 0.8)
						],
						y: [
							Math.random() * (dimensions.height * 0.8),
							Math.random() * (dimensions.height * 0.8),
							Math.random() * (dimensions.height * 0.8)
						],
						scale: [0, 1, 1, 0],
						rotate: [0, 180, 360]
					}}
					transition={{
						duration: 20 + index * 2,
						repeat: Infinity,
						ease: 'linear',
						delay: index * 0.5
					}}
					style={{
						left: `${10 + (index % 4) * 20}%`,
						top: `${10 + Math.floor(index / 4) * 30}%`
					}}
				>
					<Icon size={24 + (index % 3) * 8} />
				</motion.div>
			))}
		</div>
	)
} 