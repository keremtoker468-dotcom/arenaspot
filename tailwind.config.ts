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
        background: "#ffffff",
        foreground: "#0a0a0a",
        accent: {
          DEFAULT: "#e63946",
          dark: "#c1121f",
          light: "#fff0f1",
          border: "#ffd0d3",
        },
        border: "#eaeaea",
        muted: "#888888",
        faint: "#bbbbbb",
        surface: "#f7f7f7",
      },
      fontFamily: {
        heading: ['"Barlow Condensed"', "sans-serif"],
        body: ['"Barlow"', "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.35s ease forwards",
        "fade-up-1": "fadeUp 0.35s ease 0.05s forwards",
        "fade-up-2": "fadeUp 0.35s ease 0.1s forwards",
        "fade-up-3": "fadeUp 0.35s ease 0.15s forwards",
      },
    },
  },
  plugins: [],
};
export default config;
