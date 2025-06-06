"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface ConnectionLineProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  isActive?: boolean;
  isCompleted?: boolean;
  delay?: number;
  index?: number;
}

export function ConnectionLine({
  from,
  to,
  isActive = false,
  isCompleted = false,
  delay = 0,
  index = 0,
}: ConnectionLineProps) {
  // Simplified but elegant path calculation
  const pathData = useMemo(() => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Create a smooth curve with simple control points
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;

    // Control point offset for natural curve
    const controlOffset = Math.min(distance * 0.2, 50);
    const controlX = midX;
    const controlY = midY - controlOffset;

    // Create smooth quadratic bezier path
    const path = `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;

    // Calculate path length for dash animations
    const pathLength = distance * 1.2;

    return {
      path,
      pathLength,
      distance,
      midX,
      midY,
    };
  }, [from.x, from.y, to.x, to.y]);

  // Simplified animation variants
  const pathVariants = {
    hidden: {
      strokeDashoffset: pathData.pathLength,
      opacity: 0,
    },
    visible: {
      strokeDashoffset: 0,
      opacity: 1,
      transition: {
        strokeDashoffset: {
          duration: 1.2,
          ease: "easeOut",
          delay: delay + index * 0.15,
        },
        opacity: {
          duration: 0.3,
          delay: delay + index * 0.15,
        },
      },
    },
    completed: {
      strokeDashoffset: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Determine current state
  const currentState = isCompleted
    ? "completed"
    : isActive
      ? "visible"
      : "hidden";

  // Generate unique IDs
  const gradientId = `gradient-${index}`;
  const shadowId = `shadow-${index}`;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        width: "100%",
        height: "100%",
        overflow: "visible",
      }}
    >
      {/* Gradients and filters */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            stopColor={
              isCompleted ? "#10b981" : isActive ? "#3b82f6" : "#94a3b8"
            }
          />
          <stop
            offset="50%"
            stopColor={
              isCompleted ? "#34d399" : isActive ? "#60a5fa" : "#cbd5e1"
            }
          />
          <stop
            offset="100%"
            stopColor={
              isCompleted ? "#10b981" : isActive ? "#3b82f6" : "#94a3b8"
            }
          />
        </linearGradient>

        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="2"
            floodColor="rgba(0,0,0,0.1)"
          />
        </filter>
      </defs>

      {/* Background glow for active/completed connections */}
      {(isActive || isCompleted) && (
        <motion.path
          d={pathData.path}
          stroke={isCompleted ? "#10b981" : "#3b82f6"}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          opacity="0.3"
          filter="blur(3px)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.5, delay: delay + index * 0.15 + 0.3 }}
        />
      )}

      {/* Main connection path */}
      <motion.path
        d={pathData.path}
        stroke={`url(#${gradientId})`}
        strokeWidth={isActive || isCompleted ? "3" : "2"}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={pathData.pathLength}
        variants={pathVariants}
        initial="hidden"
        animate={currentState}
        filter={`url(#${shadowId})`}
      />

      {/* Animated traveling dot for active connections */}
      {isActive && !isCompleted && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + index * 0.15 + 0.8 }}
        >
          <motion.circle
            r="4"
            fill="#3b82f6"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
          >
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              path={pathData.path}
            />
            <animate
              attributeName="r"
              values="4;5;4"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </motion.circle>

          {/* Trailing particle */}
          <motion.circle r="2" fill="#60a5fa" opacity="0.7">
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              path={pathData.path}
              begin="0.3s"
            />
          </motion.circle>
        </motion.g>
      )}

      {/* Success celebration for completed connections */}
      {isCompleted && (
        <motion.g>
          {/* Success pulse at destination */}
          <motion.circle
            cx={to.x}
            cy={to.y}
            r="8"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 1.8],
            }}
            transition={{
              duration: 1,
              delay: delay + index * 0.15 + 1,
            }}
          />

          {/* Sparkle effect */}
          <motion.text
            x={to.x}
            y={to.y - 20}
            textAnchor="middle"
            className="text-sm"
            fill="#10b981"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 0.8,
              delay: delay + index * 0.15 + 1.2,
            }}
          >
            ✨
          </motion.text>
        </motion.g>
      )}

      {/* Debug: Show path coordinates (remove this in production) */}
      {process.env.NODE_ENV === "development" && (
        <g opacity="0.1">
          <circle cx={from.x} cy={from.y} r="2" fill="red" />
          <circle cx={to.x} cy={to.y} r="2" fill="blue" />
          <text x={from.x + 5} y={from.y - 5} fontSize="10" fill="red">
            {from.x},{from.y}
          </text>
          <text x={to.x + 5} y={to.y - 5} fontSize="10" fill="blue">
            {to.x},{to.y}
          </text>
        </g>
      )}
    </svg>
  );
}
