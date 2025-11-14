'use client';

import { useEffect, useRef } from 'react';

// Define the properties of a single "haze" particle
interface HazeParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
}

export default function CrimsonHazeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<HazeParticle[]>([]);

  // Your "crimson" color from tailwind.config.js
  const hazeColor = '#991b1b'; 
  // The RGB for the rgba() fill
  const hazeColorRGB = '153, 27, 27'; 
  // Your "near black" bg from tailwind.config.js
  const bgColor = 'rgba(10, 10, 10, 0.05)'; 

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

    const createParticle = (): HazeParticle => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 80 + 30; // 30px to 110px
      const speedY = (Math.random() - 0.5) * 0.1; // Very slow drift
      const speedX = (Math.random() - 0.5) * 0.1; // Very slow drift
      return { x, y, size, speedY, speedX };
    };

    const initParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 30000);
      particles.current = [];
      for (let i = 0; i < particleCount; i++) {
        particles.current.push(createParticle());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      // This creates the long, fading trail effect
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p, index) => {
        // 1. Update particle position
        p.y += p.speedY;
        p.x += p.speedX;

        // 2. Recycle particles that drift off-screen
        if (p.y < -p.size || 
            p.y > canvas.height + p.size || 
            p.x < -p.size || 
            p.x > canvas.width + p.size) 
        {
          particles.current[index] = createParticle();
        }

        // 3. Draw the particle
        ctx.beginPath();
        // Use a very low opacity for the fill, the "glow" does the work
        ctx.fillStyle = `rgba(${hazeColorRGB}, 0.05)`; 
        ctx.shadowColor = hazeColor;
        ctx.shadowBlur = 40; // Large blur for a "smoky" effect
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });
      
      // Reset shadow for the next frame
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
  }, [hazeColor, hazeColorRGB, bgColor]);

  return (
    <canvas
      ref={canvasRef}
      className="crimson-haze-bg"
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