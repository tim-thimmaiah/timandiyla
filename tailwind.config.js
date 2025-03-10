/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ash: {
          50: "rgba(0, 0, 0, 0.02)",
          100: "rgba(0, 0, 0, 0.05)",
          200: "rgba(0, 0, 0, 0.1)",
          300: "rgba(0, 0, 0, 0.2)",
          400: "rgba(0, 0, 0, 0.3)",
          500: "rgba(0, 0, 0, 0.4)",
          600: "rgba(0, 0, 0, 0.5)",
          700: "rgba(0, 0, 0, 0.6)",
          800: "rgba(0, 0, 0, 0.7)",
          900: "rgba(0, 0, 0, 0.8)",
          950: "rgba(0, 0, 0, 0.9)",
        },
        redz: {
          50: "#fbf4f7",
          100: "#f9eaf1",
          200: "#f4d6e3",
          300: "#edb4cb",
          400: "#e086a9",
          500: "#d36189",
          600: "#bf4369",
          700: "#a0304f",
          800: "#892b44",
          900: "#73283c",
          950: "#45121f",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [],
};
