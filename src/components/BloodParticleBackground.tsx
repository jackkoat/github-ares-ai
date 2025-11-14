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
}

export default function BloodParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);

  const particleCoreColor = '96, 5, 5'; // A deep, dark blood red
  const particleGlowColor = '#dc2626'; // Your theme's bright red-primary
  
  // TWEAK 1: Make the background fade slower for longer trails
  const bgColor = 'rgba(10, 10, 10, 0.05)'; // Was 0.1

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
      const x = Math.random() < 0.5 ? -20 : canvas.width + 20;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 3 + 1; // 1px to 4px
      
      const speedX = (Math.random() * 0.5 + 0.2) * (x < 0 ? 1 : -1);
      const speedY = (Math.random() - 0.5) * 0.2; // Very slight vertical drift
      
      const opacity = Math.random() * 0.5 + 0.3; // Vary opacity for depth
      
      return { x, y, size, speedY, speedX, opacity };
    };

    const initParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      particles.current = [];
      for (let i = 0; i < particleCount; i++) {
        particles.current.push(createParticle());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      // Fading trail effect
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p, index) => {
        // 1. Update particle position
        p.y += p.speedY;
        p.x += p.speedX;

        // TWEAK 2: Make the particle fade out much slower
        p.opacity -= 0.0008; // Was 0.002

        // 2. Recycle particles that are off-screen or faded
        if (p.opacity <= 0 || p.x < -20 || p.x > canvas.width + 20) {
          particles.current[index] = createParticle();
        }

        // 3. Draw the particle
        ctx.beginPath();
        ctx.fillStyle = `rgba(${particleCoreColor}, ${p.opacity})`;
        ctx.shadowColor = particleGlowColor;
        ctx.shadowBlur = 10; // This adds the "glow"
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });
      
      // Reset glow for next frame
      ctx.shadowBlur = 0;
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
  }, [particleCoreColor, particleGlowColor, bgColor]);

  return (
    <canvas
      ref={canvasRef}
      className="blood-particle-bg"
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