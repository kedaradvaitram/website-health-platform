import React, { useMemo } from 'react';
import { AnimatedScore } from './AnimatedScore';
import { Language } from '../types';

interface CircularGaugeChartProps {
  score: number;
  grade?: string;
  lang?: Language;
  size?: number;
  showLabels?: boolean;
}

export const CircularGaugeChart: React.FC<CircularGaugeChartProps> = ({
  score,
  grade,
  lang = 'en',
  size = 220,
  showLabels = true,
}) => {
  // Clamp score between 0 and 100
  const normalizedScore = Math.min(100, Math.max(0, score));

  // Geometry configuration
  const cx = 110;
  const cy = 105;
  const radius = 72;
  const strokeWidth = 12;

  // Arc sweeps 240 degrees from -120° (bottom-left) to +120° (bottom-right)
  const startAngle = -120;
  const endAngle = 120;
  const totalSweep = endAngle - startAngle; // 240 deg

  // Calculate current score angle
  const scoreAngle = startAngle + (normalizedScore / 100) * totalSweep;

  // Helper functions for SVG polar coordinate calculations
  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, start: number, end: number) => {
    const startPoint = polarToCartesian(x, y, r, start);
    const endPoint = polarToCartesian(x, y, r, end);
    const largeArcFlag = end - start <= 180 ? '0' : '1';
    return `M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`;
  };

  // Full background track arc path
  const backgroundTrackPath = useMemo(
    () => describeArc(cx, cy, radius, startAngle, endAngle),
    [cx, cy, radius, startAngle, endAngle]
  );

  // Active progress arc path
  const progressPath = useMemo(() => {
    if (normalizedScore <= 0.5) return '';
    return describeArc(cx, cy, radius, startAngle, scoreAngle);
  }, [cx, cy, radius, startAngle, scoreAngle, normalizedScore]);

  // Indicator tip coordinates
  const needlePoint = useMemo(
    () => polarToCartesian(cx, cy, radius, scoreAngle),
    [cx, cy, radius, scoreAngle]
  );

  // Color gradient definitions based on score brackets
  const { gradientId, colorFrom, colorTo, glowColor, statusText, statusBadgeBg } = useMemo(() => {
    if (normalizedScore >= 90) {
      return {
        gradientId: 'gauge-emerald',
        colorFrom: '#10b981', // emerald-500
        colorTo: '#06b6d4', // cyan-500
        glowColor: 'rgba(16, 185, 129, 0.4)',
        statusText: lang === 'te' ? 'అద్భుతమైన స్థితి' : 'Excellent Health',
        statusBadgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    }
    if (normalizedScore >= 75) {
      return {
        gradientId: 'gauge-teal',
        colorFrom: '#0d9488', // teal-600
        colorTo: '#3b82f6', // blue-500
        glowColor: 'rgba(13, 148, 136, 0.35)',
        statusText: lang === 'te' ? 'మంచి స్థితి' : 'Good Performance',
        statusBadgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
      };
    }
    if (normalizedScore >= 50) {
      return {
        gradientId: 'gauge-amber',
        colorFrom: '#f59e0b', // amber-500
        colorTo: '#ea580c', // orange-600
        glowColor: 'rgba(245, 158, 11, 0.35)',
        statusText: lang === 'te' ? 'మెరుగుపరచాలి' : 'Needs Optimization',
        statusBadgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    }
    return {
      gradientId: 'gauge-rose',
      colorFrom: '#f43f5e', // rose-500
      colorTo: '#dc2626', // red-600
      glowColor: 'rgba(244, 63, 94, 0.35)',
      statusText: lang === 'te' ? 'క్లిష్టమైన స్థితి' : 'Critical Issues',
      statusBadgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    };
  }, [normalizedScore, lang]);

  // Generate tick marks (11 ticks from 0 to 100 at 10% steps)
  const ticks = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => {
      const tickScore = i * 10;
      const tickAngle = startAngle + (tickScore / 100) * totalSweep;
      const isMajor = i % 2 === 0; // 0, 20, 40, 60, 80, 100
      const innerR = radius - (isMajor ? 12 : 8);
      const outerR = radius - 4;
      const p1 = polarToCartesian(cx, cy, innerR, tickAngle);
      const p2 = polarToCartesian(cx, cy, outerR, tickAngle);
      const isPassed = tickScore <= normalizedScore;

      return {
        tickScore,
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
        isMajor,
        isPassed,
      };
    });
  }, [cx, cy, radius, startAngle, totalSweep, normalizedScore]);

  // Boundary labels positions (0 and 100)
  const zeroPos = useMemo(() => polarToCartesian(cx, cy, radius + 15, startAngle), [cx, cy, radius, startAngle]);
  const hundredPos = useMemo(() => polarToCartesian(cx, cy, radius + 15, endAngle), [cx, cy, radius, endAngle]);

  const calculatedGrade = grade || (normalizedScore >= 90 ? 'A+' : normalizedScore >= 80 ? 'A' : normalizedScore >= 70 ? 'B' : normalizedScore >= 50 ? 'C' : 'D');

  return (
    <div className="flex flex-col items-center justify-center relative w-full select-none" style={{ maxWidth: size }}>
      <div className="relative w-full aspect-[220/190] flex items-center justify-center">
        <svg
          viewBox="0 0 220 190"
          className="w-full h-full drop-shadow-xs overflow-visible"
          aria-label={`Overall Audit Score Gauge: ${normalizedScore} out of 100`}
          role="img"
        >
          <defs>
            {/* Dynamic Score Gradient */}
            <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorFrom} />
              <stop offset="100%" stopColor={colorTo} />
            </linearGradient>

            {/* Subtle glow filter for the needle/progress tip */}
            <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={colorTo} floodOpacity="0.6" />
            </filter>
          </defs>

          {/* 1. Background Inactive Arc Track */}
          <path
            d={backgroundTrackPath}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-700"
          />

          {/* 2. Inner Track Scale Ticks */}
          {ticks.map((tick) => (
            <line
              key={`tick-${tick.tickScore}`}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={tick.isPassed ? colorFrom : '#cbd5e1'}
              strokeWidth={tick.isMajor ? 2 : 1}
              strokeLinecap="round"
              opacity={tick.isPassed ? 0.9 : 0.4}
              className="transition-colors duration-500"
            />
          ))}

          {/* 3. Active Progress Gradient Arc */}
          {normalizedScore > 0.5 && (
            <path
              d={progressPath}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          )}

          {/* 4. Tip Glowing Indicator Bead */}
          {normalizedScore > 0 && (
            <g className="transition-all duration-1000 ease-out">
              <circle
                cx={needlePoint.x}
                cy={needlePoint.y}
                r={strokeWidth / 2 + 1}
                fill="#ffffff"
                stroke={colorTo}
                strokeWidth="2.5"
                filter="url(#gauge-glow)"
              />
              <circle
                cx={needlePoint.x}
                cy={needlePoint.y}
                r={2}
                fill={colorTo}
              />
            </g>
          )}

          {/* 5. Min (0) and Max (100) Baseline Calibration Text */}
          {showLabels && (
            <>
              <text
                x={zeroPos.x - 2}
                y={zeroPos.y + 4}
                textAnchor="middle"
                className="fill-slate-400 font-mono text-[10px] font-bold"
              >
                0
              </text>
              <text
                x={hundredPos.x + 2}
                y={hundredPos.y + 4}
                textAnchor="middle"
                className="fill-slate-400 font-mono text-[10px] font-bold"
              >
                100
              </text>
            </>
          )}
        </svg>

        {/* 6. Score Center Core Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-5 text-center pointer-events-none">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-mono">
              <AnimatedScore value={normalizedScore} />
            </span>
            <span className="text-slate-400 text-sm sm:text-base font-bold ml-1">/100</span>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-[11px] font-black px-2 py-0.5 rounded-md border ${statusBadgeBg}`}>
              Grade {calculatedGrade}
            </span>
          </div>
        </div>
      </div>

      {/* 7. Bottom Health Status Description Pill */}
      <div className="mt-1 flex items-center justify-center">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: colorTo }}
          />
          <span>{statusText}</span>
        </span>
      </div>
    </div>
  );
};
