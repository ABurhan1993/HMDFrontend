/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        success: {
          100: "#dcfce7",
          500: "#22c55e",
        },
        error: {
          100: "#fee2e2",
          500: "#ef4444",
        },
        warning: {
          100: "#fef9c3",
          500: "#eab308",
        },
        dark: {
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
        },
      },
      boxShadow: {
        'theme-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'theme-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'theme-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'theme-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
