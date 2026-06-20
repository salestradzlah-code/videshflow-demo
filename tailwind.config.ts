import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        cream: "#fafafa",
        "cream-soft": "#f4f4f5",
        teal: "#059669",
        "teal-dark": "#047857",
        gold: "#10b981",
        ink: "#18181b",
      },
      boxShadow: {
        premium: "0 24px 80px rgba(5, 150, 105, 0.10)",
      },
    },
  },
};

export default config;
