import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  color?: "blue" | "green" | "purple" | "yellow";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorClasses = {
  blue: "bg-blue-600",
  green: "bg-green-600",
  purple: "bg-purple-600",
  yellow: "bg-yellow-600",
};

const sizeClasses = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

export function ProgressBar({
  current,
  total,
  label,
  showPercentage = true,
  color = "blue",
  size = "md",
  className,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-gray-500">
              {current}/{total} ({percentage}%)
            </span>
          )}
        </div>
      )}
      
      <div className={cn("w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", sizeClasses[size])}>
        <motion.div
          className={cn("h-full rounded-full", colorClasses[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}