'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { Button } from './button'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
	id: string
	type: ToastType
	title: string
	description?: string
	duration?: number
	action?: {
		label: string
		onClick: () => void
	}
}

interface ToastContextType {
	toasts: Toast[]
	addToast: (toast: Omit<Toast, 'id'>) => void
	removeToast: (id: string) => void
	clearToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([])

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id))
	}, [])

	const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
		const id = Math.random().toString(36).substr(2, 9)
		const newToast = { ...toast, id }
		
		setToasts((prev) => [...prev, newToast])

		// Auto remove toast after duration
		const duration = toast.duration ?? 5000
		if (duration > 0) {
			setTimeout(() => {
				removeToast(id)
			}, duration)
		}
	}, [removeToast])

	const clearToasts = useCallback(() => {
		setToasts([])
	}, [])

	return (
		<ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
			{children}
		</ToastContext.Provider>
	)
}

export function useToast() {
	const context = useContext(ToastContext)
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider')
	}
	return context
}

const toastIcons = {
	success: CheckCircle,
	error: AlertCircle,
	warning: AlertTriangle,
	info: Info,
}

const toastStyles = {
	success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100',
	error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
	warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100',
	info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100',
}

const iconStyles = {
	success: 'text-green-500',
	error: 'text-red-500',
	warning: 'text-yellow-500',
	info: 'text-blue-500',
}

function ToastItem({ toast }: { toast: Toast }) {
	const { removeToast } = useToast()
	const Icon = toastIcons[toast.type]

	return (
		<motion.div
			initial={{ opacity: 0, y: 50, scale: 0.3 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
			className={`relative flex w-full max-w-sm items-start space-x-3 rounded-lg border p-4 shadow-lg ${toastStyles[toast.type]}`}
		>
			<Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconStyles[toast.type]}`} />
			
			<div className="flex-1 space-y-1">
				<div className="text-sm font-medium">{toast.title}</div>
				{toast.description && (
					<div className="text-sm opacity-90">{toast.description}</div>
				)}
				{toast.action && (
					<Button
						variant="ghost"
						size="sm"
						onClick={toast.action.onClick}
						className="h-auto p-0 text-xs font-medium hover:bg-transparent"
					>
						{toast.action.label}
					</Button>
				)}
			</div>

			<Button
				variant="ghost"
				size="sm"
				onClick={() => removeToast(toast.id)}
				className="h-auto p-0 text-current hover:bg-transparent"
			>
				<X className="h-4 w-4" />
				<span className="sr-only">Close</span>
			</Button>
		</motion.div>
	)
}

export function Toaster() {
	const { toasts } = useToast()

	return (
		<div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
			<AnimatePresence>
				{toasts.map((toast) => (
					<ToastItem key={toast.id} toast={toast} />
				))}
			</AnimatePresence>
		</div>
	)
}

// Create a toast instance that can be used outside of React components
let toastInstance: ToastContextType | null = null

export function setToastInstance(instance: ToastContextType) {
	toastInstance = instance
}

// Convenience functions for different toast types
export const toast = {
	success: (title: string, description?: string, options?: Partial<Toast>) => {
		if (toastInstance) {
			toastInstance.addToast({ type: 'success', title, description, ...options })
		}
	},
	error: (title: string, description?: string, options?: Partial<Toast>) => {
		if (toastInstance) {
			toastInstance.addToast({ type: 'error', title, description, ...options })
		}
	},
	warning: (title: string, description?: string, options?: Partial<Toast>) => {
		if (toastInstance) {
			toastInstance.addToast({ type: 'warning', title, description, ...options })
		}
	},
	info: (title: string, description?: string, options?: Partial<Toast>) => {
		if (toastInstance) {
			toastInstance.addToast({ type: 'info', title, description, ...options })
		}
	},
}