/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Cyber-Brutalist Brand Colors
        "cyber-black": "var(--cyber-black)",
        "cyber-white": "#f8f9fa",
        "cyber-gray": "#1a1a1a",
        "neon-red": "var(--neon-red)",
        "neon-green": "var(--neon-green)",
        "neon-yellow": "var(--neon-yellow)",
        "neon-blue": "var(--neon-blue)",
        grade: {
          S: "#00f0ff",
          A: "#00ff41",
          B: "#fcee0a",
          C: "#ff8c00",
          D: "#ff003c",
          F: "#8b0000",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-white': '4px 4px 0px 0px rgba(255,255,255,1)',
        'brutal-green': '4px 4px 0px 0px #00ff41',
        'brutal-red': '4px 4px 0px 0px #ff003c',
        'brutal-yellow': '4px 4px 0px 0px #fcee0a',
        'brutal-blue': '4px 4px 0px 0px #00f0ff',
      }
    },
  },
  plugins: [],
};
