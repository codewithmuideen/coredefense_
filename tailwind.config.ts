import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E6AFF",
          50: "#EAF1FF",
          100: "#D5E3FF",
          200: "#ABC7FF",
          300: "#7FA9FF",
          400: "#528BFF",
          500: "#1E6AFF",
          600: "#1854CC",
          700: "#123F99",
          800: "#0C2A66",
          900: "#061533",
        },
        ink: {
          DEFAULT: "#080B14",
          900: "#0A0D16",
          800: "#0F1420",
          700: "#161C2C",
          600: "#1F2738",
          500: "#2C3548",
        },
        surface: {
          DEFAULT: "#F4F4F4",
          white: "#FFFFFF",
          near: "#FEFEFE",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        "8xl": "90rem",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        glow: "glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
