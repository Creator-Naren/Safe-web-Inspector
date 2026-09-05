import React from 'react';
import { motion } from 'motion/react';

interface ScoreGaugeProps {
  score: number;
  threatLevel: 'safe' | 'caution' | 'suspicious' | 'malicious';
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, threatLevel, size = 'md' }) => {
  const getColor = () => {
    switch (threatLevel) {
      case 'safe':
        return { stroke: '#10b981', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800' };
      case 'caution':
        return { stroke: '#f59e0b', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800' };
      case 'suspicious':
        return { stroke: '#f97316', text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/40', border: 'border-orange-200 dark:border-orange-800' };
      case 'malicious':
        return { stroke: '#ef4444', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-200 dark:border-rose-800' };
      default:
        return { stroke: '#6b7280', text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-900', border: 'border-slate-200 dark:border-slate-800' };
    }
  };

  const colors = getColor();
  const radius = size === 'lg' ? 52 : size === 'md' ? 42 : 28;
  const strokeWidth = size === 'lg' ? 9 : size === 'md' ? 7 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <svg
          width={svgSize}
          height={svgSize}
          className="rotate-[-90deg] transition-all duration-700 ease-out"
        >
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-700/60"
            fill="transparent"
          />
          {/* Progress circle */}
          <motion.circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span
            className={`font-extrabold tracking-tight ${colors.text} ${
              size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-lg'
            }`}
          >
            {score}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 -mt-1">/100</span>
        </div>
      </div>
    </div>
  );
};
