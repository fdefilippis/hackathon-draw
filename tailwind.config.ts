import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Accenture brand palette
        accenture: {
          purple: "#A100FF",
          purpleDeep: "#7500C0",
          purpleDark: "#460073",
          purpleLight: "#BE82FF",
          purpleSoft: "#DCAFFF",
          magenta: "#FF50A0",
          black: "#000000",
          ink: "#0A0014",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(161, 0, 255, 0.6)",
        glowStrong: "0 0 120px -10px rgba(161, 0, 255, 0.8)",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-24px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
      animation: {
        floatSlow: "floatSlow 7s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        pulseRing: "pulseRing 2.4s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
