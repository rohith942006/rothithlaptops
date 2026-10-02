import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0F19",
          800: "#1A1F2B",
          700: "#2B3140",
          600: "#4A5262",
          500: "#6B7385",
          400: "#9AA1AF",
        },
        surface: {
          DEFAULT: "#F5F6F8",
          2: "#EEF0F3",
        },
        line: "#E5E7EB",
        accent: {
          DEFAULT: "#2453F0",
          600: "#1C43CC",
          50: "#EEF2FF",
        },
        sale: "#D9381E",
        success: "#0E8A55",
        night: "#090C14",
      },
      fontFamily: {
        display: ['"Sora"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,15,25,0.04), 0 8px 24px -12px rgba(11,15,25,0.12)",
        lift: "0 2px 4px rgba(11,15,25,0.04), 0 24px 48px -20px rgba(11,15,25,0.28)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up .5s cubic-bezier(.2,.7,.2,1) both",
        "slide-in": "slide-in .35s cubic-bezier(.2,.7,.2,1) both",
        shimmer: "shimmer 1.4s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
