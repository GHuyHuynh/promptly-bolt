import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-neutral-200 shadow-sm',
        hover && 'hover:shadow-lg hover:border-neutral-300 transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
};