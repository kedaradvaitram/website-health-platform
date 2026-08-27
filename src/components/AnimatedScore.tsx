import React, { useEffect, useState, useRef } from 'react';

interface AnimatedScoreProps {
  value: number;
  duration?: number; // ms
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  highlightChange?: boolean;
}

export const AnimatedScore: React.FC<AnimatedScoreProps> = ({
  value,
  duration = 1200,
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
  highlightChange = true,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const prevValueRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    startTimeRef.current = null;
    setIsAnimating(true);

    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const current = startValue + (endValue - startValue) * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        prevValueRef.current = endValue;
        setIsAnimating(false);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  const formattedNumber = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toString();

  return (
    <span
      className={`inline-block tabular-nums transition-all ${
        isAnimating && highlightChange ? 'scale-105 transition-transform' : ''
      } ${className}`}
    >
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};

interface AnimatedScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
  subLabel?: string;
  className?: string;
}

export const AnimatedScoreGauge: React.FC<AnimatedScoreGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  showLabel = true,
  label,
  subLabel,
  className = '',
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1400;

    const animateGauge = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      setAnimatedScore(Math.round(score * easeProgress));

      if (progress < 1) {
        requestAnimationFrame(animateGauge);
      }
    };

    const animId = requestAnimationFrame(animateGauge);
    return () => cancelAnimationFrame(animId);
  }, [score]);

  // Color selection based on score
  let strokeColor = '#10b981'; // Emerald
  let bgGlowColor = 'rgba(16, 185, 129, 0.15)';
  let textColor = 'text-emerald-500';

  if (score < 50) {
    strokeColor = '#f43f5e'; // Rose
    bgGlowColor = 'rgba(244, 63, 94, 0.15)';
    textColor = 'text-rose-500';
  } else if (score < 80) {
    strokeColor = '#f59e0b'; // Amber
    bgGlowColor = 'rgba(245, 158, 11, 0.15)';
    textColor = 'text-amber-500';
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800 fill-transparent"
        />
        {/* Animated score stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="fill-transparent transition-all duration-75"
          style={{
            filter: `drop-shadow(0 0 6px ${bgGlowColor})`,
          }}
        />
      </svg>

      {/* Center text score */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`text-3xl sm:text-4xl font-black ${textColor} tracking-tight`}>
          <AnimatedScore value={score} duration={1400} />
        </span>
        {showLabel && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            {label || '/ 100'}
          </span>
        )}
        {subLabel && (
          <span className="text-[9px] text-slate-400 font-medium">{subLabel}</span>
        )}
      </div>
    </div>
  );
};
