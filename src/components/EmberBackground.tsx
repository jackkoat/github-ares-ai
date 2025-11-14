'use client';

import { useEffect, useRef } from 'react';

// Define the properties of a single particle
interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
}

export default function EmberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);

  // Use your theme's red-primary color
  const emberColor = '#600505ff';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const setCanvasDimensions = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();

    const createParticle = (): Particle => {
      const x = Math.random() * canvas.width;
      const y = canvas.height + Math.random() * 100; // Start below the screen
      const size = Math.random() * 2.5 + 1;
      const speedY = Math.random() * 1.5 + 0.5; // Speed moving up
      const speedX = (Math.random() - 0.5) * 1.0; // Horizontal drift
      return {
        x,
        y,
        size,
        speedY,
        speedX,
        opacity: 1,
        color: emberColor,
      };
    };

    const initParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 20000);
      particles.current = [];
      for (let i = 0; i < particleCount; i++) {
        particles.current.push(createParticle());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      // Use the "bg-near-black" for the fade effect
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p, index) => {
        // 1. Update particle position
        p.y -= p.speedY;
        p.x += p.speedX;
        p.opacity -= 0.005; // Fade out slowly

        // 2. Recycle particles that are off-screen or faded
        if (p.y < -10 || p.opacity <= 0) {
          particles.current[index] = createParticle();
        }

        // 3. Draw the particle
        ctx.beginPath();
        ctx.fillStyle = `rgba(220, 38, 38, ${p.opacity})`; // Use theme red
        ctx.shadowColor = emberColor;
        ctx.shadowBlur = 10; // This adds the "glow"
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    const handleResize = () => {
      setCanvasDimensions();
      initParticles(); // Re-init particles for new size
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [emberColor]);

  return (
    <canvas
      ref={canvasRef}
      className="ember-bg"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1, // Behind all content
        pointerEvents: 'none', // Not interactive
        backgroundColor: '#0a0a0a', // Match bg-near-black
      }}
    />
  );
}