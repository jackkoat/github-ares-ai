/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			fontFamily: {
				primary: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
				display: ['Outfit', 'Inter', 'sans-serif'],
				mono: ['JetBrains Mono', 'Courier New', 'monospace'],
			},
			colors: {
				// UFC Design System Colors
				'bg-pure-black': '#000000',
				'bg-near-black': '#0a0a0a',
				'bg-elevated': '#141414',
				'bg-hover': '#1e1e1e',
				'red-primary': '#dc2626',
				'red-hover': '#ef4444',
				'red-glow': 'rgba(220, 38, 38, 0.5)',
				'red-gradient-start': '#dc2626',
				'red-gradient-end': '#991b1b',
				'text-primary': '#e4e4e7',
				'text-secondary': '#a1a1aa',
				'text-tertiary': '#71717a',
				'text-white': '#ffffff',
				'success-green': '#22c55e',
				'warning-amber': '#f59e0b',
				'error-red': '#ef4444',
				'border-subtle': 'rgba(255, 255, 255, 0.1)',
				'border-moderate': 'rgba(255, 255, 255, 0.15)',
				'border-strong': 'rgba(255, 255, 255, 0.2)',
				'border-red': 'rgba(220, 38, 38, 0.4)',
				// Legacy compatibility
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#dc2626',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: '#1e1e1e',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					DEFAULT: '#dc2626',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				sm: '8px',
				md: '12px',
				lg: '16px',
				xl: '24px',
				full: '9999px',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			boxShadow: {
				'glow-card': '0 0 0 1px rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.5)',
				'glow-card-hover': '0 0 0 1px rgba(255, 255, 255, 0.15), 0 8px 24px rgba(0, 0, 0, 0.6)',
				'glow-red-primary': '0 0 20px rgba(220, 38, 38, 0.5), 0 0 40px rgba(220, 38, 38, 0.3)',
				'glow-red-subtle': '0 0 12px rgba(220, 38, 38, 0.3)',
			},
			letterSpacing: {
				tight: '-0.02em',
				normal: '0',
				wide: '0.01em',
				wider: '0.02em',
			},
			lineHeight: {
				tight: '1.1',
				snug: '1.2',
				normal: '1.3',
				relaxed: '1.5',
				loose: '1.6',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(220, 38, 38, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.8)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}