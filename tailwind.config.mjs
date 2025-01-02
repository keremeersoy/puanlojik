/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
			// success: {
			// 	DEFAULT: 'var(--success)',
			// 	'foreground': 'var(--success-foreground)'
			// },
			// info: {
			// 	DEFAULT: 'var(--info)',
			// 	'foreground': 'var(--info-foreground)'
			// },
			// warning: {
			// 	DEFAULT: 'var(--warning)',
			// 	'foreground': 'var(--warning-foreground)'
			// },
			// purple: {
			// 	DEFAULT: 'var(--purple)',
			// 	'foreground': 'var(--purple-foreground)'
			// },
			// orange: {
			// 	DEFAULT: 'var(--orange)',
			// 	'foreground': 'var(--orange-foreground)'
			// }
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
