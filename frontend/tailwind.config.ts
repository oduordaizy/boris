import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        boris: {
          bg: "#F9F9F8",        // Warm white
          text: "#1A1A1A",      // Soft black
          primary: "#2D6A4F",   // Muted green
          surface: "#EFEFED",   // Muted surface
          border: "#E0DFDB",    // Subtle border
          overdue: "#C0392B",   // Red
          soon: "#D97706",      // Amber
          completed: "#6B7280", // Grey
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
