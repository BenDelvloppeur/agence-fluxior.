/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				background: '#030712', // gray-950
				surface: '#111827', // gray-900
				surfaceHighlight: '#1f2937', // gray-800
				primary: {
					DEFAULT: '#6366f1', // indigo-500
					foreground: '#e0e7ff', // indigo-100
				},
				secondary: {
					DEFAULT: '#a855f7', // purple-500
					foreground: '#f3e8ff', // purple-100
				},
				muted: '#9ca3af', // gray-400
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				display: ['Space Grotesk', 'sans-serif'],
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #6366f1 0deg, #a855f7 50%, #ec4899 100%)',
			},
			animation: {
				'blob': 'blob 7s infinite',
				'fade-in': 'fadeIn 0.5s ease-out forwards',
				'slide-up': 'slideUp 0.5s ease-out forwards',
				'meteor-effect': "meteor 5s linear infinite",
			},
			keyframes: {
				blob: {
					'0%': { transform: 'translate(0px, 0px) scale(1)' },
					'33%': { transform: 'translate(30px, -50px) scale(1.1)' },
					'66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
					'100%': { transform: 'translate(0px, 0px) scale(1)' },
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				meteor: {
					"0%": { transform: "rotate(260deg) translateX(0)", opacity: "1" },
					"70%": { opacity: "1" },
					"100%": {
						transform: "rotate(260deg) translateX(-1000px)",
						opacity: "0",
					},
				},
			}
		},
	},
	plugins: [],
}