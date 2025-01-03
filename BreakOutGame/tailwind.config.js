/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
      theme: {
        extend: {
          animation: {
            particleBurst: "particleBurst 0.8s ease-out",
          },
          keyframes: {
            particleBurst: {
              "0%": {
                transform: "translate(0, 0) scale(1)",
                opacity: "1",
              },
              "100%": {
                transform: "translate(var(--tw-translate-x), var(--tw-translate-y)) scale(0.5)",
                opacity: "0",
              },
            },
          },
        },
        
    
  },
  plugins: [],
}

