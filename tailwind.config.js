/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          darkbg: "#2c2c2a", // لون الوضع الليلي الجديد
          lighttext: "#ffffff",
          darktext: "#999999", // للنهاري (رمادي مريح)
        },
      },
    },
    plugins: [],
  }
  