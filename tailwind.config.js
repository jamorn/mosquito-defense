/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "game-dark": "#0f172a",
        "game-darker": "#050810",
        "game-panel": "#1e293b",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px #06b6d4, 0 0 10px #06b6d4" },
          "100%": { boxShadow: "0 0 20px #06b6d4, 0 0 30px #06b6d4" },
        },
      },
    },
  },
  plugins: [],
};
