import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f0f5f3",
          100: "#dce8e4",
          200: "#b8d1c9",
          300: "#8fb5a9",
          400: "#6a9789",
          500: "#4A7C6F",
          600: "#3d665c",
          700: "#33524a",
          800: "#2b433d",
          900: "#253834",
        },
        warm: {
          50: "#FAFAF8",
          100: "#F5F4F0",
          200: "#EBEAE4",
          300: "#DDDCD4",
          400: "#C4C3BA",
          500: "#A8A79E",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      backdropBlur: {
        glass: "20px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(74, 124, 111, 0.08)",
        soft: "0 4px 24px rgba(0, 0, 0, 0.04)",
        elevated: "0 12px 48px rgba(0, 0, 0, 0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
