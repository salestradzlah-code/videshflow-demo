import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        cream: "#F5F5DC",
        "cream-soft": "#FAF7EA",
        teal: "#004D4D",
        "teal-dark": "#003737",
        gold: "#D4AF37",
        ink: "#172326",
      },
      boxShadow: {
        premium: "0 24px 80px rgba(0, 77, 77, 0.12)",
      },
    },
  },
};

export default config;
