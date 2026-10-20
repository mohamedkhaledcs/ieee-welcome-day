import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "background-secondary": "var(--background-secondary)",
        foreground: "var(--foreground)",
        "foreground-muted": "var(--foreground-muted)",
        accent: {
          blue: "var(--accent-blue)",
          cyan: "var(--accent-cyan)",
        },
        border: "var(--border)",
        card: "var(--card)",
        "card-hover": "var(--card-hover)",
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "var(--font-cairo)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glow: "0 0 40px rgba(59, 130, 246, 0.12)",
        "glow-cyan": "0 0 30px rgba(34, 211, 238, 0.08)",
        card: "0 4px 24px rgba(0, 0, 0, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        float: "float 6s ease-in-out infinite",
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
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
