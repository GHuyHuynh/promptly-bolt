'use client'

import { motion } from 'framer-motion'

interface Company {
	name: string
	logo: string
	width?: number
	height?: number
}

interface CompanyLogosProps {
	companies?: Company[]
	title?: string
	className?: string
	speed?: number
}

// Default companies if none provided
const defaultCompanies: Company[] = [
	{ name: 'Microsoft', logo: '/logos/microsoft.svg', width: 120, height: 40 },
	{ name: 'Google', logo: '/logos/google.svg', width: 100, height: 40 },
	{ name: 'Amazon', logo: '/logos/amazon.svg', width: 100, height: 40 },
	{ name: 'Apple', logo: '/logos/apple.svg', width: 40, height: 40 },
	{ name: 'Meta', logo: '/logos/meta.svg', width: 100, height: 40 },
	{ name: 'Netflix', logo: '/logos/netflix.svg', width: 100, height: 40 },
	{ name: 'Spotify', logo: '/logos/spotify.svg', width: 100, height: 40 },
	{ name: 'Uber', logo: '/logos/uber.svg', width: 80, height: 40 }
]

export function CompanyLogos({ 
	companies = defaultCompanies, 
	title = "Trusted by learners at leading companies",
	className = '',
	speed = 30
}: CompanyLogosProps) {
	// Duplicate companies for seamless loop
	const duplicatedCompanies = [...companies, ...companies]

	return (
		<div className={`py-12 ${className}`}>
			{title && (
				<motion.div
					className="text-center mb-8"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
						{title}
					</h3>
				</motion.div>
			)}

			<div className="relative overflow-hidden">
				{/* Gradient Masks */}
				<div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10" />
				<div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10" />

				{/* Scrolling Container */}
				<motion.div
					className="flex items-center gap-12"
					animate={{
						x: ['0%', -50 * companies.length + '%']
					}}
					transition={{
						duration: speed,
						repeat: Infinity,
						ease: 'linear'
					}}
					style={{ width: '200%' }}
				>
					{duplicatedCompanies.map((company, index) => (
						<motion.div
							key={`${company.name}-${index}`}
							className="flex-shrink-0 flex items-center justify-center"
							style={{ minWidth: '150px' }}
							whileHover={{ scale: 1.1 }}
							transition={{ type: 'spring', stiffness: 400, damping: 10 }}
						>
							{/* For demo purposes, we'll use colored rectangles representing logos */}
							<div 
								className="bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-200"
								style={{ 
									width: company.width || 100, 
									height: company.height || 40 
								}}
							>
								<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
									{company.name}
								</span>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>

			{/* Stats Below Logos */}
			<motion.div
				className="grid grid-cols-3 gap-8 mt-12 max-w-md mx-auto"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6, delay: 0.3 }}
			>
				{[
					{ number: '500+', label: 'Companies' },
					{ number: '50K+', label: 'Professionals' },
					{ number: '95%', label: 'Success Rate' }
				].map((stat, index) => (
					<motion.div
						key={stat.label}
						className="text-center"
						initial={{ scale: 0 }}
						whileInView={{ scale: 1 }}
						viewport={{ once: true }}
						transition={{ 
							delay: 0.5 + index * 0.1, 
							type: 'spring', 
							stiffness: 260, 
							damping: 20 
						}}
					>
						<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
							{stat.number}
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400">
							{stat.label}
						</div>
					</motion.div>
				))}
			</motion.div>
		</div>
	)
}