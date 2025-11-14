'use client';

import { useEffect, useRef } from 'react';

export default function DataStreamBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // TWEAK 1: Use your app's color palette from tailwind.config.js
  const colors = [
    '#dc2626', // red-primary
    '#a1a1aa', // text-secondary
    '#71717a', // text-tertiary
    '#e4e4e7', // text-primary
  ];

  // TWEAK 2: Use "data" characters, not Katakana
  const characters = '0123456789.%';
  const charArray = characters.split('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    function draw() {
      if (!ctx || !canvas) return;

      // TWEAK 3: Use your site's "bg-near-black" (#0a0a0a) for the trail
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // TWEAK 4: Pick a random color from your palette for each character
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const newColumns = Math.floor(canvas.width / fontSize);
      drops.length = 0; // Clear the old array
      for (let i = 0; i < newColumns; i++) {
        drops[i] = 1;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [colors, charArray]); // Re-run if props changed (though they won't here)

  return (
    <canvas
      ref={canvasRef}
      className="particle-bg"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}