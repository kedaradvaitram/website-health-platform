import React, { useEffect, useRef } from 'react';

interface SmokeBackgroundProps {
  className?: string;
  density?: 'low' | 'medium' | 'high';
  tint?: 'emerald' | 'cyan' | 'mixed' | 'cyber';
  interactive?: boolean;
}

interface StarParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  color: string;
  glowColor: string;
  depth: number;
}

interface RippleWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export const SmokeBackground: React.FC<SmokeBackgroundProps> = ({
  className = '',
  density = 'high',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let stars: StarParticle[] = [];
    let ripples: RippleWave[] = [];
    const mouse = { x: -1000, y: -1000, active: false, targetX: -1000, targetY: -1000 };
    let time = 0;

    const starCount = density === 'low' ? 35 : density === 'high' ? 70 : 50;

    const starColors = [
      { fill: '#67e8f9', glow: 'rgba(6, 182, 212, 0.6)' },   // Cyan
      { fill: '#a7f3d0', glow: 'rgba(16, 185, 129, 0.6)' },  // Emerald
      { fill: '#c4b5fd', glow: 'rgba(139, 92, 246, 0.6)' },  // Violet
      { fill: '#fbcfe8', glow: 'rgba(244, 63, 94, 0.6)' },   // Rose
      { fill: '#fde68a', glow: 'rgba(245, 158, 11, 0.6)' },  // Amber
      { fill: '#93c5fd', glow: 'rgba(59, 130, 246, 0.6)' },  // Blue
      { fill: '#ffffff', glow: 'rgba(255, 255, 255, 0.8)' },  // Pure White
    ];

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const colorSet = starColors[Math.floor(Math.random() * starColors.length)];
        const depth = 0.3 + Math.random() * 0.7; // 3D depth layer
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25 * depth,
          vy: (Math.random() - 0.5) * 0.25 * depth,
          radius: (0.8 + Math.random() * 1.8) * depth,
          baseAlpha: 0.25 + Math.random() * 0.45,
          alpha: 0.3,
          pulseSpeed: 0.015 + Math.random() * 0.025,
          pulsePhase: Math.random() * Math.PI * 2,
          color: colorSet.fill,
          glowColor: colorSet.glow,
          depth,
        });
      }
    };

    const handleResize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (stars.length === 0 || width !== rect.width) {
        initStars();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !container) return;
      const rect = container.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;

      // Create gentle interactive light ripple occasionally
      if (Math.random() < 0.08) {
        const rippleColor = starColors[Math.floor(Math.random() * starColors.length)].glow;
        ripples.push({
          x: mouse.targetX,
          y: mouse.targetY,
          radius: 10,
          maxRadius: 110 + Math.random() * 60,
          alpha: 0.35,
          color: rippleColor,
        });
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Render Silky Smooth Aurora Ribbon Wave
    const drawAuroraWaves = () => {
      time += 0.004; // Smooth, peaceful slow frequency (easy on eyes)

      // Layer 1: Emerald & Cyan Oceanic Aurora
      const grad1 = ctx.createLinearGradient(0, 0, width, height * 0.9);
      grad1.addColorStop(0, 'rgba(16, 185, 129, 0.16)');
      grad1.addColorStop(0.3, 'rgba(6, 182, 212, 0.22)');
      grad1.addColorStop(0.65, 'rgba(99, 102, 241, 0.18)');
      grad1.addColorStop(1, 'rgba(236, 72, 153, 0.12)');

      ctx.save();
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const wave1 = Math.sin(x * 0.0035 + time * 0.9) * 40;
        const wave2 = Math.cos(x * 0.006 - time * 0.6) * 22;
        const y = height * 0.52 + wave1 + wave2;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Layer 2: Violet, Magenta & Golden Glow Ribbons
      const grad2 = ctx.createLinearGradient(width, 0, 0, height);
      grad2.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
      grad2.addColorStop(0.35, 'rgba(244, 63, 94, 0.18)');
      grad2.addColorStop(0.7, 'rgba(168, 85, 247, 0.22)');
      grad2.addColorStop(1, 'rgba(14, 165, 233, 0.14)');

      ctx.save();
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const wave1 = Math.cos(x * 0.004 - time * 0.8) * 38;
        const wave2 = Math.sin(x * 0.007 + time * 1.1) * 20;
        const y = height * 0.65 + wave1 + wave2;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Layer 3: Subtle Luminous Crest Line
      ctx.save();
      const lineGrad = ctx.createLinearGradient(0, 0, width, 0);
      lineGrad.addColorStop(0, 'rgba(52, 211, 153, 0)');
      lineGrad.addColorStop(0.25, 'rgba(56, 189, 248, 0.45)');
      lineGrad.addColorStop(0.5, 'rgba(192, 132, 252, 0.55)');
      lineGrad.addColorStop(0.75, 'rgba(251, 146, 60, 0.4)');
      lineGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');

      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 20) {
        const y =
          height * 0.58 +
          Math.sin(x * 0.0035 + time * 0.9) * 40 +
          Math.cos(x * 0.006 - time * 0.6) * 22;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    };

    // Render interactive ripples
    const drawRipples = () => {
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 1.4;
        r.alpha *= 0.96;

        ctx.save();
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = Math.max(0, r.alpha);
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        if (r.alpha <= 0.01 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }
    };

    // Render glittering stardust and constellation lines
    const drawStarsAndConstellations = () => {
      // Smooth mouse lerp
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      }

      // Draw faint connections between nearby stars
      ctx.save();
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const s1 = stars[i];
          const s2 = stars[j];
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const lineAlpha = (1 - dist / 100) * 0.12 * Math.min(s1.alpha, s2.alpha);
            ctx.strokeStyle = `rgba(165, 180, 252, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // Render star sparkles
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Organic twinkling sine pulse
        s.pulsePhase += s.pulseSpeed;
        s.alpha = s.baseAlpha + Math.sin(s.pulsePhase) * 0.25;

        // Position update
        s.x += s.vx;
        s.y += s.vy;

        // Wrap around screen
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        // Gentle interactive mouse attraction
        if (mouse.active) {
          const dx = mouse.x - s.x;
          const dy = mouse.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160 && dist > 0) {
            const force = (1 - dist / 160) * 0.8;
            s.x += (dx / dist) * force;
            s.y += (dy / dist) * force;
            s.alpha = Math.min(1, s.alpha + 0.35);
          }
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));

        // Soft outer aura glow
        const glowGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 3.5);
        glowGrad.addColorStop(0, s.glowColor);
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Bright sparkling star core
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    };

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing aurora fluid ribbons
      drawAuroraWaves();

      // 2. Draw ripples
      drawRipples();

      // 3. Draw stardust & constellation connections
      drawStarsAndConstellations();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [density, interactive]);

  return (
    <div
      ref={containerRef}
      id="smoke-flow-background-container"
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      {/* High Performance Hardware Accelerated Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-100 transition-opacity duration-700"
      />

      {/* Radiant Luminous Cosmic Ambient Orbs (Smooth, eye-safe, saturated color blooms) */}
      <div className="absolute -top-16 -left-10 w-[30rem] h-[30rem] bg-gradient-to-br from-violet-600/30 via-indigo-500/20 to-transparent rounded-full blur-[100px] animate-float-glow-1 pointer-events-none" />
      <div className="absolute top-10 -right-10 w-[32rem] h-[32rem] bg-gradient-to-bl from-cyan-500/30 via-teal-500/20 to-transparent rounded-full blur-[110px] animate-float-glow-2 pointer-events-none" />
      <div className="absolute bottom-4 left-1/3 w-[26rem] h-[22rem] bg-gradient-to-t from-emerald-500/25 via-amber-500/20 to-transparent rounded-full blur-[90px] animate-float-glow-3 pointer-events-none" />
      <div className="absolute -bottom-10 right-1/4 w-[24rem] h-[24rem] bg-gradient-to-tr from-rose-500/25 via-pink-500/20 to-transparent rounded-full blur-[85px] pointer-events-none" />

      {/* Soft Vignette Fade for Maximum Text Contrast & Comfort */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />
    </div>
  );
};

